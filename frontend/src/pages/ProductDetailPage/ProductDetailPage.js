import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error al obtener los detalles del producto');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-detail">
      {product ? (
        <>
          <img src={product.imageUrl} alt={product.name} />
          <h1>{product.name}</h1>
          <p>Precio: ${product.price}</p>
          <p>Descripción: {product.description}</p>
          <p>Vendedor: {product.seller}</p>
          <p>Disponibilidad: {product.availability}</p>
          <p>Cantidad: {product.quantity}</p>
        </>
      ) : (
        <p>Producto no encontrado</p>
      )}
    </div>
  );
};

export default ProductDetailPage;
