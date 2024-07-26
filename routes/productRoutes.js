const express = require('express');
const router = express.Router();

// Datos de productos (puedes reemplazar esto con una base de datos real)
let products = [];

// Endpoint para buscar productos por nombre
router.get('/search', (req, res) => {
  const searchTerm = req.query.q ? req.query.q.toLowerCase() : '';
  if (searchTerm) {
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );
    res.json(filteredProducts);
  } else {
    res.json(products); // Devuelve todos los productos si no hay término de búsqueda
  }
});

module.exports = (upload) => {
  // Obtener todos los productos
  router.get('/', (req, res) => {
    res.json(products);
  });

  // Crear un nuevo producto
  router.post('/', upload.single('image'), (req, res) => {
    const { name, description, price, brand, quantity } = req.body;
    const newProduct = {
      id: Date.now(),
      name,
      description,
      price,
      brand,
      quantity,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  });

  // Actualizar un producto
  router.put('/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, description, price, brand, quantity } = req.body;
    const productIndex = products.findIndex((product) => product.id == id);

    if (productIndex !== -1) {
      const updatedProduct = {
        ...products[productIndex],
        name,
        description,
        price,
        brand,
        quantity,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : products[productIndex].imageUrl
      };

      products[productIndex] = updatedProduct;
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  });

  // Eliminar un producto
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    products = products.filter((product) => product.id != id);
    res.status(204).send();
  });

  return router;
};
