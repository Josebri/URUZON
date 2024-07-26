import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Cambiado de useHistory a useNavigate

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();  // Cambiado de useHistory a useNavigate
  const userId = 'currentUserId'; // Obtén el ID del usuario autenticado de tu sistema de autenticación

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);  // Cambiado de history.push a navigate
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`, {
        data: { userId }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <div>
      <h1>Productos en Venta</h1>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <img src={product.image} alt={product.name} />
            {product.userId === userId && (
              <>
                <button onClick={() => handleEdit(product._id)}>Editar</button>
                <button onClick={() => handleDelete(product._id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductListPage;
