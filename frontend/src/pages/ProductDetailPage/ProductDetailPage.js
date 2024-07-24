import React from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const product = {
        id,
        name: 'Producto Detalle',
        price: 200,
        description: 'Descripción detallada del producto.',
        imageUrl: '/product-detail.jpg',
        seller: 'Vendedor XYZ',
        availability: 'Disponible',
        quantity: 10
    };

    return (
        <div className="product-detail">
            <img src={product.imageUrl} alt={product.name} />
            <h1>{product.name}</h1>
            <p>Precio: ${product.price}</p>
            <p>Descripción: {product.description}</p>
            <p>Vendedor: {product.seller}</p>
            <p>Disponibilidad: {product.availability}</p>
            <p>Cantidad: {product.quantity}</p>
        </div>
    );
};

export default ProductDetailPage;
