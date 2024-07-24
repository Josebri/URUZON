import React, { useState } from 'react';
import './UserProfile.css';

const UserProfile = () => {
    const [userData, setUserData] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        location: 'New York'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos actualizados:', userData);
        // Lógica para actualizar datos en el servidor
    };

    return (
        <div className="user-profile">
            <h1>Actualizar Perfil</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={userData.name} onChange={handleInputChange} placeholder="Nombre" />
                <input type="email" name="email" value={userData.email} onChange={handleInputChange} placeholder="Correo Electrónico" />
                <input type="text" name="phone" value={userData.phone} onChange={handleInputChange} placeholder="Teléfono" />
                <input type="text" name="location" value={userData.location} onChange={handleInputChange} placeholder="Ubicación" />
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default UserProfile;
