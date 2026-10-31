const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.getDashboardStats = async (req, res) => {
    try {
        const [[usersRows], [storesRows], [ratingsRows]] = await Promise.all([
            db.query('SELECT COUNT(*) AS count FROM users'),
            db.query('SELECT COUNT(*) AS count FROM stores'),
            db.query('SELECT COUNT(*) AS count FROM ratings')
        ]);

        res.status(200).json({
            message: "Admin Dashboard Statistics fetched successfully",
            data: {
                total_users: parseInt(usersRows[0]?.count || 0, 10),
                total_stores: parseInt(storesRows[0]?.count || 0, 10),
                total_ratings: parseInt(ratingsRows[0]?.count || 0, 10)
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching dashboard stats." });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;

        const validSortColumns = ['name', 'email', 'address', 'role'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
        const sortOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

        let query = `
            SELECT u.id, u.name, u.email, u.address, u.role, 
                   COALESCE(s_avg.avg_rating, 0) as owner_rating
            FROM users u
            LEFT JOIN stores s ON u.id = s.owner_id
            LEFT JOIN (
                SELECT store_id, ROUND(AVG(rating), 1) as avg_rating 
                FROM ratings GROUP BY store_id
            ) s_avg ON s.id = s_avg.store_id
            WHERE 1=1
        `;
        let params = [];

        if (name) {
            query += ` AND u.name LIKE ?`;
            params.push(`%${name}%`);
        }
        if (email) {
            query += ` AND u.email LIKE ?`;
            params.push(`%${email}%`);
        }
        if (address) {
            query += ` AND u.address LIKE ?`;
            params.push(`%${address}%`);
        }
        if (role) {
            query += ` AND u.role = ?`;
            params.push(role);
        }

        query += ` ORDER BY u.${sortColumn} ${sortOrder}`;

        const [rows] = await db.query(query, params);
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching users." });
    }
};

exports.addUserByAdmin = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        // Validations
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ error: "Name must be between 20 and 60 characters." });
        }
        if (!address || address.length > 400) {
            return res.status(400).json({ error: "Address cannot exceed 400 characters." });
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Password must be 8-16 chars with 1 uppercase and 1 special char." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userRole = role || 'NORMAL_USER';

        const [result] = await db.query(
            'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, userRole]
        );

        res.status(201).json({
            message: "User added successfully!",
            user: {
                id: result.insertId,
                name,
                email,
                role: userRole
            }
        });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
            return res.status(400).json({ error: "Email already exists." });
        }
        res.status(500).json({ error: "Server error while adding user." });
    }
};
