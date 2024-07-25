import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products'); // Asegúrate de que el puerto sea el correcto
        setProducts(response.data);
      } catch (err) {
        console.error('Error al obtener los productos:', err);
        setError('Error al obtener los productos');
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p>{error}</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Marca: {product.brand}</p>
            <p>Cantidad: {product.quantity}</p>
            {product.imageUrl && <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} style={{ width: '100px' }} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
