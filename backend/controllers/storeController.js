const db = require('../config/db');

exports.addStore = async (req, res) => {
    try {
        const { name, email, address } = req.body;

        // Basic validation
        if (!name || !email || !address) {
            return res.status(400).json({ error: "Name, email, and address are required." });
        }

        const [userCheck] = await db.query(
            "SELECT id FROM users WHERE email = ? AND role = 'STORE_OWNER'",
            [email]
        );

        let owner_id = null;
        if (userCheck && userCheck.length > 0) {
            owner_id = userCheck[0].id;
        }

        const [result] = await db.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address, owner_id]
        );

        const [storeRows] = await db.query('SELECT * FROM stores WHERE id = ?', [result.insertId]);

        res.status(201).json({
            message: "Store added successfully !",
            store: storeRows[0] || { id: result.insertId, name, email, address, owner_id }
        });

    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
            return res.status(400).json({ error: "A store with this email already exist, try with another email." });
        }
        res.status(500).json({ error: "Store addition failed. Server error occurred." });
    }
};

exports.getStores = async (req, res) => {
    try {
        const user_id = req.user.id;

        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'name';
        const order = (req.query.order || 'ASC').toUpperCase();
        const validSortColumns = ['name', 'address', 'overall_rating'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
        const sortOrder = ['ASC', 'DESC'].includes(order) ? order : 'ASC';

        const searchTerm = `%${search}%`;

        const query = `
            SELECT 
                s.id AS store_id,
                s.name,
                s.email,
                s.address,
                COALESCE(ROUND(AVG(r.rating), 1), 0) AS overall_rating,
                (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) AS user_submitted_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.name LIKE ? OR s.address LIKE ?
            GROUP BY s.id, s.name, s.email, s.address
            ORDER BY ${sortColumn} ${sortOrder}
        `;

        const [stores] = await db.query(query, [user_id, searchTerm, searchTerm]);

        res.status(200).json({
            message: "Stores fetched successfully.",
            data: stores || []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Store fetch failed. Server error occurred." });
    }
};
