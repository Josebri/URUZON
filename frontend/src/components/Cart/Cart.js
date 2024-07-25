// components/Cart/Cart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('/api/cart');
                setCartItems(response.data);
            } catch (error) {
                console.error('Error al obtener los elementos del carrito:', error);
            }
        };

        fetchCartItems();
    }, []);

    const handleRemoveItem = async (id) => {
        try {
            await axios.delete(`/api/cart/${id}`);
            setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
        }
    };

    const handleCheckout = async () => {
        try {
            await axios.post('/api/checkout');
            alert('Compra realizada con éxito');
            setCartItems([]);
        } catch (error) {
            console.error('Error al realizar la compra:', error);
        }
    };

    return (
        <div className="cart">
            <h2>Carrito de Compras</h2>
            <ul>
                {cartItems.map(item => (
                    <li key={item.id}>
                        {item.name} - ${item.price}
                        <button onClick={() => handleRemoveItem(item.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleCheckout}>Proceder al Pago</button>
        </div>
    );
};

export default Cart;
