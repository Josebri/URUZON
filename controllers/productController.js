const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Añadir un nuevo producto
const addProduct = async (req, res) => {
  const { name, description, price, quantity, brand } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (price < 0 || quantity < 0) {
    return res.status(400).json({ message: 'El precio y la cantidad deben ser positivos' });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      brand,
      image,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir producto' });
  }
};

// Actualizar un producto existente
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, brand } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (price < 0 || quantity < 0) {
    return res.status(400).json({ message: 'El precio y la cantidad deben ser positivos' });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.brand = brand || product.brand;

    if (image) {
      // Eliminar la imagen anterior
      if (product.image) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(product.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.image = image;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminar la imagen del servidor
    if (product.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', path.basename(product.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
