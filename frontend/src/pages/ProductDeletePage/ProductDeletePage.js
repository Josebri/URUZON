import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductDeletePage.css';

const ProductDeletePage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!selectedProductId) {
      alert('Por favor, selecciona un producto para eliminar.');
      return;
    }

    try {
      await axios.delete(`/api/products/${selectedProductId}`);
      setProducts(products.filter(product => product.id !== selectedProductId));
      navigate('/products');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <div className="product-delete-page">
      <h2>Eliminar Producto</h2>
      <select onChange={(e) => setSelectedProductId(e.target.value)} value={selectedProductId || ''}>
        <option value="" disabled>Selecciona un producto</option>
        {products.map(product => (
          <option key={product.id} value={product.id}>{product.name}</option>
        ))}
      </select>
      <button onClick={handleDelete}>Eliminar Producto</button>
    </div>
  );
};

export default ProductDeletePage;
