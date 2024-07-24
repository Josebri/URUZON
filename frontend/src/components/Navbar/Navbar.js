import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando:', searchTerm);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="../../assets/cart-logo.png"
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
          <img
            src="../../assets/products-icon.png"
            alt="Productos"
            className="nav-icon"
            onClick={() => setProductsMenuOpen(!productsMenuOpen)}
          />
          {productsMenuOpen && (
            <div className="products-menu">
              <Link to="/products" className="products-menu-item">Ver Productos en Venta</Link>
              <Link to="/products/new" className="products-menu-item">Nuevo Producto</Link>
              <Link to="/products/edit" className="products-menu-item">Editar Producto</Link>
              <Link to="/products/delete" className="products-menu-item">Eliminar Producto</Link>
            </div>
          )}
        </div>
        <Link to="/favorites" className="nav-link favorites-link">Favoritos</Link>
        <img
          src="../../assets/usuario.png"
          alt="Usuario"
          className="user-icon"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        />
        {userMenuOpen && (
          <div className="user-menu">
            <button onClick={() => window.location.href = '/profile'}>Actualizar Perfil</button>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
