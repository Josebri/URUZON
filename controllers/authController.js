const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Registro de usuario
exports.registerUser = async (data) => {
    const { name, lastname, username, email, password, phone, location } = data;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (name, lastname, username, email, password, phone, location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [name, lastname, username, email, hashedPassword, phone, location]
        );
        return newUser.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// Login de usuario
exports.loginUser = async (data) => {
    const { usernameOrEmail, password } = data;
    try {
        const user = await pool.query(
            "SELECT * FROM users WHERE username = $1 OR email = $2",
            [usernameOrEmail, usernameOrEmail]
        );
        if (user.rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            throw new Error('Contraseña inválida');
        }
        const token = jwt.sign({ id: user.rows[0].id }, 'secret_key', { expiresIn: '1h' });
        return { token, user: user.rows[0] };
    } catch (err) {
        throw new Error(err.message);
    }
};