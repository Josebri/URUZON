const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 5000;

// Configuración de Multer para la subida de imágenes
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importa las rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes')(upload); // Pasamos el middleware de Multer
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
