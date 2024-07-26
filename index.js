// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'store',
  password: '29930427',
  port: 5432,
});

const secret = 'your_jwt_secret';

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).send('No token provided.');
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(500).send('Failed to authenticate token.');
    req.userId = decoded.id;
    next();
  });
};

// Rutas

// Registro
app.post('/register', async (req, res) => {
  const { name, username, password, email } = req.body;

  if (!name || !username || !password || !email) {
    return res.status(400).send('All fields are required.');
  }

  if (username.length < 4 || username.length > 15 || password.length < 8 || password.length > 15) {
    return res.status(400).send('Invalid input lengths.');
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email format.');
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  try {
    const result = await pool.query(
      'INSERT INTO users (name, username, password, email) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, username, hashedPassword, email]
    );
    res.status(201).send({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).send('Error registering user.');
  }
});

// Login
app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [usernameOrEmail, usernameOrEmail]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).send('User not found.');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send('Invalid password.');
    }

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: 86400 }); // 24 hours

    res.status(200).send({ auth: true, token });
  } catch (error) {
    res.status(500).send('Error logging in.');
  }
});

// Obtener productos
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.status(200).send(result.rows);
  } catch (error) {
    res.status(500).send('Error fetching products.');
  }
});

// Crear producto
app.post('/products', [verifyToken, upload.single('image')], async (req, res) => {
  const { name, price, quantity, description } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, quantity, image, description, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, price, quantity, image, description, req.userId]
    );
    res.status(201).send({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).send('Error creating product.');
  }
});

// Actualizar producto
app.put('/products/:id', [verifyToken, upload.single('image')], async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, description } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, quantity = $3, image = $4, description = $5 WHERE id = $6 AND user_id = $7 RETURNING id',
      [name, price, quantity, image, description, id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Product not found or user not authorized.');
    }

    res.status(200).send({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).send('Error updating product.');
  }
});

// Eliminar producto
app.delete('/products/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Product not found or user not authorized.');
    }

    res.status(200).send({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).send('Error deleting product.');
  }
});

// Ver mis productos
app.get('/my-products', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE user_id = $1',
      [req.userId]
    );
    res.status(200).send(result.rows);
  } catch (error) {
    res.status(500).send('Error fetching your products.');
  }
});

// Añadir producto al carrito
app.post('/cart', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await pool.query('SELECT * FROM carts WHERE user_id = $1', [req.userId]);

    if (cart.rows.length === 0) {
      cart = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [req.userId]);
    }

    const cartId = cart.rows[0].id;

    const result = await pool.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id',
      [cartId, productId, quantity]
    );
    res.status(201).send({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).send('Error adding product to cart.');
  }
});

// Obtener productos del carrito
app.get('/cart', verifyToken, async (req, res) => {
  try {
    const cart = await pool.query('SELECT * FROM carts WHERE user_id = $1', [req.userId]);

    if (cart.rows.length === 0) {
      return res.status(200).send([]);
    }

    const cartId = cart.rows[0].id;

    const result = await pool.query(
      'SELECT cart_items.id, products.name, products.price, cart_items.quantity FROM cart_items JOIN products ON cart_items.product_id = products.id WHERE cart_items.cart_id = $1',
      [cartId]
    );

    res.status(200).send(result.rows);
  } catch (error) {
    res.status(500).send('Error fetching cart items.');
  }
});

// Eliminar producto del carrito
app.delete('/cart/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Cart item not found.');
    }

    res.status(200).send({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).send('Error deleting cart item.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
