// App.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ProductListPage from './pages/ProductListPage/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import UserProfile from './pages/UserProfile/UserProfile';
import ProductAddPage from './pages/ProductAddPage/ProductAddPage';
import ProductEditPage from './pages/ProductEditPage/ProductEditPage';
import ProductDeletePage from './pages/ProductDeletePage/ProductDeletePage';
import Cart from './components/Cart/Cart';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="App">
            {isAuthenticated && <Navbar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {isAuthenticated ? (
                    <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/products" element={<ProductListPage />} />
                        <Route path="/product/add" element={<ProductAddPage />} />
                        <Route path="/product/edit/:id" element={<ProductEditPage />} />
                        <Route path="/product/delete/:id" element={<ProductDeletePage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                )}
            </Routes>
        </div>
    );
}

export default App;
