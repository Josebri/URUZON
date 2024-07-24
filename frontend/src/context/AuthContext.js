import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        usernameOrEmail,
        password,
      });
      // Supongamos que guardamos el token en el localStorage
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
    } catch (error) {
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
