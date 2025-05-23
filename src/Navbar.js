import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Navbar.css";
import { UserContext } from "./utils/context";

function Navbar() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const { isAdmin, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartItemCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartItemCount(count);
    };

    updateCartItemCount();

    window.addEventListener("cartUpdated", updateCartItemCount);
    window.addEventListener("storage", updateCartItemCount);

    return () => {
      window.removeEventListener("storage", updateCartItemCount);
      window.removeEventListener("cartUpdated", updateCartItemCount);
    };
  }, []);

  const handleAccountClick = (e) => {
    e.preventDefault();
    navigate(isLoggedIn ? "/Compte" : "/login");
  };
console.log(isAdmin)
  return (
    <div>
      <img src="/logo.png" alt="Logo" id="logo" />
      <nav className="navbar">
        <div className="links">
          <Link to="/">Accueil</Link>
          {isAdmin && <Link to="/AdminPanel">Admin</Link>}
          <a href="/login" onClick={handleAccountClick}>Compte</a>
          {isLoggedIn && (
            <>
              <Link to="/Panier">Panier</Link>
              <Link to="/historique">Historique</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
