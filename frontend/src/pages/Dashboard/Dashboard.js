import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import ProductList from '../../components/ProductList/ProductList';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div className="dashboard">
            <Navbar />
            <ProductList products={products} />
        </div>
    );
};

export default Dashboard;
