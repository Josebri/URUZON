const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware para analizar cuerpos JSON
app.use(express.json());
app.use(cors());

// Importa las rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

// Usa las rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});