const pool = require('../config/db');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await pool.query("SELECT * FROM products");
        res.json(products.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addProduct = async (req, res) => {
    const { userId, price, brand, description, image, quantity } = req.body;
    try {
        const newProduct = await pool.query(
            "INSERT INTO products (user_id, price, brand, description, image, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [userId, price, brand, description, image, quantity]
        );
        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
