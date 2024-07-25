import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductEditPage.css';

const ProductEditPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    brand: '',
    description: '',
    image: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product.price < 0 || product.quantity < 0) {
      alert("El precio y la cantidad no pueden ser negativos.");
      return;
    }

    const formData = new FormData();
    for (const key in product) {
      formData.append(key, product[key]);
    }

    try {
      await axios.put(`/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/products');
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  };

  return (
    <div className="product-edit-page">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={product.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={product.price}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          value={product.quantity}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Marca"
          value={product.brand}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={product.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="file"
          onChange={handleImageChange}
        />
        <button type="submit">Actualizar Producto</button>
      </form>
    </div>
  );
};

export default ProductEditPage;
