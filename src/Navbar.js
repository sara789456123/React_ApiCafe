import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
  <div>
      <img src="/logo.png" alt="Logo" id="logo" />
      <nav className="navbar">
        <div className="links">
          <Link to="/">Accueil</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/Login">Login</Link>
          <Link to="/Panier">
            <img src="/panier.png" id="panier" alt="Panier" />
          </Link>
        </div>
      </nav>
    </div>
  );
}

function after()
{
  <img src="/logo.png" id="panier"></img>
  
}
export default Navbar;
