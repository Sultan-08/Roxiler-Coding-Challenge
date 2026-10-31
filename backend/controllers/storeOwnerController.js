const db = require('../config/db');

exports.getOwnerDashboard = async (req, res) => {
    try {
        const owner_id = req.user.id;

        const [userResult] = await db.query('SELECT email FROM users WHERE id = ?', [owner_id]);
        if (!userResult || userResult.length === 0) {
            return res.status(404).json({ error: "Owner user record not found." });
        }
        const email = userResult[0].email;

        const [storeResult] = await db.query(
            'SELECT id, name FROM stores WHERE owner_id = ? OR email = ?',
            [owner_id, email]
        );

        if (!storeResult || storeResult.length === 0) {
            return res.status(404).json({ error: "No store found linked with this owner's email." });
        }

        const store = storeResult[0];

        await db.query('UPDATE stores SET owner_id = ? WHERE id = ? AND owner_id IS NULL', [owner_id, store.id]);

        const [avgResult] = await db.query(
            'SELECT COALESCE(ROUND(AVG(rating), 1), 0) AS average_rating FROM ratings WHERE store_id = ?',
            [store.id]
        );

        const [ratersResult] = await db.query(`
            SELECT u.name, u.email, r.rating, r.updated_at as rated_on
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
            ORDER BY r.updated_at DESC
        `, [store.id]);

        res.status(200).json({
            message: "Store Owner Dashboard fetched successfully",
            store_info: {
                id: store.id,
                name: store.name,
                average_rating: parseFloat(avgResult[0]?.average_rating || 0)
            },
            raters: ratersResult || []
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching owner dashboard." });
    }
};
