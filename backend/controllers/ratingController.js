const db = require('../config/db');

exports.submitRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        const user_id = req.user.id;

        // Validation for rating (1 to 5)
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be an integer between 1 - 5." });
        }

        if (!store_id) {
            return res.status(400).json({ error: "Store ID is required." });
        }

        // MySQL UPSERT Query: Insert if new, Update if exists on (user_id, store_id)
        const ratingQuery = `
            INSERT INTO ratings (user_id, store_id, rating, updated_at) 
            VALUES (?, ?, ?, NOW()) 
            ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = NOW()
        `;

        await db.query(ratingQuery, [user_id, store_id, rating]);

        // Fetch the inserted or updated rating row
        const [rows] = await db.query(
            'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
            [user_id, store_id]
        );

        res.status(200).json({
            message: "Rating updated successfully !",
            data: rows[0] || { user_id, store_id, rating }
        });

    } catch (err) {
        console.error(err);

        // Handle case where store_id doesn't exist in stores table (MySQL foreign key violation)
        if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW' || err.errno === 1452) {
            return res.status(404).json({ error: "Store not exist." });
        }

        res.status(500).json({ error: "Rating update failed. Server error occurred !" });
    }
};
