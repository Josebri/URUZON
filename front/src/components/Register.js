// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (username.length < 4 || username.length > 15) {
      setError('El nombre de usuario debe tener entre 4 y 15 caracteres.');
      return false;
    }
    if (password.length < 8 || password.length > 15) {
      setError('La contraseña debe tener entre 8 y 15 caracteres.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('El correo electrónico no es válido.');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:3000/register', {
        name,
        username,
        email,
        password,
      });
      navigate('/');
    } catch (err) {
      setError('Error al registrarse. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="register-container">
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength="4"
            maxLength="15"
          />
          <small>Debe tener entre 4 y 15 caracteres.</small>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <small>Debe ser un correo electrónico válido.</small>
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="8"
            maxLength="15"
          />
          <small>Debe tener entre 8 y 15 caracteres.</small>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Registrarse</button>
      </form>
      <button onClick={() => navigate('/')}>Volver al Login</button>
    </div>
  );
};

export default Register;
