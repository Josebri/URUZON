const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const multer = require('multer');
const app = express();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'uruzon',
    password: '29930427',
    port: 5432,
});

app.use(express.json());

// Middleware para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Registro de usuario
app.post('/register', async (req, res) => {
    const { name, lastname, username, password, email, security_question_1, security_question_2, phone, profile } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, lastname, username, password, email, security_question_1, security_question_2, phone, profile) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [name, lastname, username, hashedPassword, email, security_question_1, security_question_2, phone, profile]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login de usuario
app.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [usernameOrEmail, usernameOrEmail]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const user = result.rows[0];

        if (user.is_locked) {
            return res.status(403).json({ error: 'Usuario bloqueado' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            await pool.query(
                'UPDATE users SET login_attempts = login_attempts - 1 WHERE id = $1',
                [user.id]
            );

            if (user.login_attempts - 1 === 0) {
                await pool.query(
                    'UPDATE users SET is_locked = TRUE WHERE id = $1',
                    [user.id]
                );
                return res.status(403).json({ error: 'Usuario bloqueado' });
            }

            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        await pool.query(
            'UPDATE users SET login_attempts = 3 WHERE id = $1',
            [user.id]
        );

        const token = jwt.sign({ id: user.id, profile: user.profile }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout de usuario
app.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

// Agregar producto (Admin)
app.post('/products', upload.array('images'), async (req, res) => {
    const { name, price, availability, description, category } = req.body;
    const images = req.files.map(file => file.path);

    try {
        const result = await pool.query(
            'INSERT INTO products (name, price, availability, description, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, price, availability, description, category]
        );

        const productId = result.rows[0].id;

        for (const image of images) {
            await pool.query(
                'INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)',
                [productId, image]
            );
        }

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar producto (Admin)
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, availability, description, category } = req.body;

    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, price = $2, availability = $3, description = $4, category = $5 WHERE id = $6 RETURNING *',
            [name, price, availability, description, category, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar producto (Admin)
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(
            'DELETE FROM products WHERE id = $1',
            [id]
        );

        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ver todos los productos
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar producto al carrito de compras (User)
app.post('/cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [userId, productId, quantity]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ver productos del carrito de compras (User)
app.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM cart WHERE user_id = $1',
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar producto del carrito de compras (User)
app.delete('/cart/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(
            'DELETE FROM cart WHERE id = $1',
            [id]
        );

        res.json({ message: 'Producto eliminado del carrito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar producto a favoritos (User)
app.post('/favorites', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *',
            [userId, productId]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ver productos favoritos (User)
app.get('/favorites/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1',
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar producto de favoritos (User)
app.delete('/favorites/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(
            'DELETE FROM favorites WHERE id = $1',
            [id]
        );

        res.json({ message: 'Producto eliminado de favoritos' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar comentario y calificación (User)
app.post('/reviews', async (req, res) => {
    const { userId, productId, rating, comment } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, productId, rating, comment]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ver comentarios y calificaciones de un producto
app.get('/reviews/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM reviews WHERE product_id = $1',
            [productId]
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
