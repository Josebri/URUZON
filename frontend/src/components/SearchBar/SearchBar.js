import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('name');

    const handleSearch = () => {
        console.log(`Buscando ${query} con filtro ${filter}`);
    };

    return (
        <div className="search-bar">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="name">Nombre</option>
                <option value="price">Precio</option>
                <option value="brand">Marca</option>
                <option value="category">Categoría</option>
            </select>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar productos..."
            />
            <button onClick={handleSearch}>Buscar</button>
        </div>
    );
};

export default SearchBar;
