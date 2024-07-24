const pool = require('../config/db');

exports.getProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { name, lastname, username, email, phone, location } = req.body;
    try {
        const updatedUser = await pool.query(
            "UPDATE users SET name = $1, lastname = $2, username = $3, email = $4, phone = $5, location = $6 WHERE id = $7 RETURNING *",
            [name, lastname, username, email, phone, location, userId]
        );
        res.json(updatedUser.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
