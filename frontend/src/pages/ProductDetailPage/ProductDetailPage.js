import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const userId = 'currentUserId'; // Obtén el ID del usuario autenticado de tu sistema de autenticación

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error al obtener el producto:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/products/${id}`, {
        data: { userId }
      });
      navigate('/products');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <p>{product.quantity}</p>
      <p>{product.brand}</p>
      <img src={product.image} alt={product.name} />
      {product.userId === userId && (
        <>
          <button onClick={() => navigate(`/edit-product/${product._id}`)}>Editar</button>
          <button onClick={handleDelete}>Eliminar</button>
        </>
      )}
    </div>
  );
};

export default ProductDetailPage;
