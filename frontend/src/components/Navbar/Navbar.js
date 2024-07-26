import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = () => {
    // Aquí deberías agregar la lógica para cerrar sesión
    window.location.href = '/login';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando:', searchTerm);
    // Aquí podrías redirigir a la página de resultados de búsqueda
    // o hacer una llamada a la API para buscar productos.
    // Por ejemplo:
    // window.location.href = `/products?search=${searchTerm}`;
  };

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src={require('../../assets/cart-logo.png')}
          alt="Carrito"
          className="cart-icon"
          onClick={() => setCartOpen(!cartOpen)}
        />
        {cartOpen && (
          <div className="cart-menu">
            <p>Productos en el carrito:</p>
            <p>No hay productos en el carrito.</p>
          </div>
        )}
      </div>
      <div className="navbar-center">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
          <button type="submit">Buscar</button>
        </form>
      </div>
      <div className="navbar-right">
        <div className="products-dropdown">
          <span onClick={toggleDropdown}>Productos</span>
          {showDropdown && (
            <div className="products-menu">
              <Link to="/products" className="products-menu-item" onClick={() => setShowDropdown(false)}>Ver Productos en Venta</Link>
              <Link to="/product/add" className="products-menu-item" onClick={() => setShowDropdown(false)}>Nuevo Producto</Link>
              <Link to="/product/edit" className="products-menu-item" onClick={() => setShowDropdown(false)}>Editar Producto</Link>
              <Link to="/product/delete" className="products-menu-item" onClick={() => setShowDropdown(false)}>Eliminar Producto</Link>
            </div>
          )}
        </div>
        <Link to="/dashboard" className="nav-link home-link">Home</Link>
        <img
          src={require('../../assets/usuario.png')}
          alt="Usuario"
          className="user-icon"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        />
        {userMenuOpen && (
          <div className="user-menu">
            <Link to="/profile">Actualizar Perfil</Link>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
