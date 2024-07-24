import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>{product.price} $</p>
            <button>Agregar al carrito</button>
            <button>Agregar a Favoritos</button>
        </div>
    );
};

export default ProductCard;
