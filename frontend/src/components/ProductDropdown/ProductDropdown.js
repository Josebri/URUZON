import React from 'react';
import { Link } from 'react-router-dom';
import './ProductDropdown.css';

const ProductDropdown = () => {
  return (
    <div className="products-menu">
      <Link to="/products" className="products-menu-item">Ver Productos en Venta</Link>
      <Link to="/product/add" className="products-menu-item">Nuevo Producto</Link>
      <Link to="/product/edit" className="products-menu-item">Editar Producto</Link>
      <Link to="/product/delete" className="products-menu-item">Eliminar Producto</Link>
    </div>
  );
};

export default ProductDropdown;
