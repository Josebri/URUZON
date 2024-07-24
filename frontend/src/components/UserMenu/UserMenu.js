import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';

const UserMenu = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleUpdateProfile = () => {
        navigate('/profile');
    };

    return (
        <div className="user-menu">
            <button onClick={handleLogout}>Cerrar Sesión</button>
            <button onClick={handleUpdateProfile}>Actualizar Datos</button>
        </div>
    );
};

export default UserMenu;
