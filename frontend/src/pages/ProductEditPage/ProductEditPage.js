import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    brand: ''
  });
  const [file, setFile] = useState(null);
  const userId = 'currentUserId'; // Obtén el ID del usuario autenticado de tu sistema de autenticación

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setFormValues({
        name: response.data.name,
        description: response.data.description,
        price: response.data.price,
        quantity: response.data.quantity,
        brand: response.data.brand
      });
    } catch (error) {
      console.error('Error al obtener el producto:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', formValues.name);
    formData.append('description', formValues.description);
    formData.append('price', formValues.price);
    formData.append('quantity', formValues.quantity);
    formData.append('brand', formValues.brand);
    formData.append('userId', userId);
    if (file) {
      formData.append('image', file);
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
    <div>
      <h1>Editar Producto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Descripción</label>
          <input
            type="text"
            name="description"
            value={formValues.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Precio</label>
          <input
            type="number"
            name="price"
            value={formValues.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Cantidad</label>
          <input
            type="number"
            name="quantity"
            value={formValues.quantity}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Marca</label>
          <input
            type="text"
            name="brand"
            value={formValues.brand}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Imagen</label>
          <input
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Actualizar Producto</button>
      </form>
    </div>
  );
};

export default EditProductPage;
