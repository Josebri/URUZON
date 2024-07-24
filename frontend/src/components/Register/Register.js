import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    username: '',
    email: '',
    phone: '',
    location: '',
    password: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    const { name, lastname, username, email, phone, location, password } = formData;

    if (name.length < 4 || name.length > 20) newErrors.name = 'El nombre debe tener entre 4 y 20 caracteres';
    if (lastname.length < 4 || lastname.length > 20) newErrors.lastname = 'El apellido debe tener entre 4 y 20 caracteres';
    if (username.length < 4 || username.length > 20) newErrors.username = 'El nombre de usuario debe tener entre 4 y 20 caracteres';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email inválido';
    if (phone.length !== 11) newErrors.phone = 'El teléfono debe tener 11 dígitos';
    if (location.length > 30) newErrors.location = 'La ubicación no puede tener más de 30 caracteres';
    if (password.length < 4 || password.length > 20) newErrors.password = 'La contraseña debe tener entre 4 y 20 caracteres';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      window.location.href = '/login'; // Redirige al login
    } catch (error) {
      setErrors({ ...errors, form: error.response?.data?.message || 'Error al registrar. Inténtalo de nuevo.' });
    }
  };

  return (
    <div className="register-container">
      <h2>Registrarse</h2>
      {errors.form && <div className="error">{errors.form}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength="4"
            maxLength="20"
          />
          {submitAttempted && errors.name && <div className="error-text">{errors.name}</div>}
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            minLength="4"
            maxLength="20"
          />
          {submitAttempted && errors.lastname && <div className="error-text">{errors.lastname}</div>}
        </div>
        <div>
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="4"
            maxLength="20"
          />
          {submitAttempted && errors.username && <div className="error-text">{errors.username}</div>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {submitAttempted && errors.email && <div className="error-text">{errors.email}</div>}
        </div>
        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            maxLength="11"
          />
          {submitAttempted && errors.phone && <div className="error-text">{errors.phone}</div>}
        </div>
        <div>
          <label>Ubicación:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            maxLength="30"
          />
          {submitAttempted && errors.location && <div className="error-text">{errors.location}</div>}
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="4"
            maxLength="20"
          />
          <span
            className="eye-icon"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            👁️
          </span>
          {submitAttempted && errors.password && <div className="error-text">{errors.password}</div>}
        </div>
        <button type="submit">Registrarse</button>
        <button type="button" onClick={() => window.location.href = '/login'}>Volver al inicio de sesión</button>
      </form>
    </div>
  );
};

export default Register;
