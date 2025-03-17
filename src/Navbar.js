import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h1>Les Dosettes de Mamie</h1>
      <div className="links">
        <Link to="/">Accueil</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/Login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
