import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Asegúrate de que este archivo CSS exista y esté correctamente configurado

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(usernameOrEmail, password);
      navigate('/dashboard'); // Redirige a la vista de dashboard
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Nombre de Usuario o Email:</label>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            👁️
          </span>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <div className="links">
        <a href="/register">Crear Cuenta</a>
      </div>
    </div>
  );
};

export default Login;
