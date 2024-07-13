import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Asegúrate de importar el CSS con los estilos adecuados

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        firstName: '',
        lastName: '',
        securityQuestion1: '',
        securityQuestion2: '',
        profile: 'user' // Valor de perfil por defecto
    });

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (form.username.length < 4) newErrors.username = 'Username debe tener mínimo 4 caracteres';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) newErrors.email = 'Email debe ser válido (algo@algo.algo)';
        if (form.password.length < 8) newErrors.password = 'Password debe tener mínimo 8 caracteres';
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords no coinciden';
        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(form.phone) || form.phone.length !== 11) newErrors.phone = 'Phone debe tener 11 caracteres y solo números';
        if (form.firstName.length < 4) newErrors.firstName = 'First name debe tener mínimo 4 caracteres';
        if (form.lastName.length < 4) newErrors.lastName = 'Last name debe tener mínimo 4 caracteres';
        if (form.securityQuestion1.length < 6 || form.securityQuestion1.length > 15) newErrors.securityQuestion1 = 'Security question 1 debe tener entre 6 y 15 caracteres';
        if (form.securityQuestion2.length < 6 || form.securityQuestion2.length > 15) newErrors.securityQuestion2 = 'Security question 2 debe tener entre 6 y 15 caracteres';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Limitar la longitud de los campos según corresponda
        if (name === 'phone') {
            newValue = value.replace(/\D/, '').slice(0, 11);
        } else if (name === 'securityQuestion1' || name === 'securityQuestion2') {
            newValue = value.slice(0, 15);
        } else {
            newValue = value.slice(0, 20);
        }

        setForm({ ...form, [name]: newValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            axios.post('http://localhost:5000/register', form)
                .then(response => {
                    console.log(response.data);
                    navigate('/login', { state: { message: 'Usuario registrado exitosamente' } });
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        setApiError(error.response.data.error || 'Error en el registro, inténtalo de nuevo.');
                    } else {
                        setApiError('Error en el registro, inténtalo de nuevo.');
                    }
                });
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {apiError && <p className="api-error">{apiError}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                </div>

                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                    />
                    {errors.phone && <p className="error">{errors.phone}</p>}
                </div>

                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                    />
                    {errors.firstName && <p className="error">{errors.firstName}</p>}
                </div>

                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && <p className="error">{errors.lastName}</p>}
                </div>

                <div className="form-group">
                    <label>Security Question 1</label>
                    <input
                        type="text"
                        name="securityQuestion1"
                        value={form.securityQuestion1}
                        onChange={handleChange}
                    />
                    {errors.securityQuestion1 && <p className="error">{errors.securityQuestion1}</p>}
                </div>

                <div className="form-group">
                    <label>Security Question 2</label>
                    <input
                        type="text"
                        name="securityQuestion2"
                        value={form.securityQuestion2}
                        onChange={handleChange}
                    />
                    {errors.securityQuestion2 && <p className="error">{errors.securityQuestion2}</p>}
                </div>

                <div className="form-group">
                    <label>Profile</label>
                    <select
                        name="profile"
                        value={form.profile}
                        onChange={handleChange}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;