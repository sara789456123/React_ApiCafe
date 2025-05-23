import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Compte.css";

function Compte() {
  const navigate = useNavigate();
  const [adresse, setAdresse] = useState({
    ville: "",
    rue: "",
    cp: "",
    pays: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!Cookies.get("isLoggedIn")) {
      navigate("/login");
    }

    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/check-token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isAdmin !== undefined) {
            setIsAdmin(data.isAdmin);
          }
        })
        .catch((error) => console.error("Erreur token:", error));
    }
    fetch(`http://172.17.0.56:8000/api/utilisateur/${userId}/adresse`)
      .then((res) => res.json())
      .then((data) => setAdresse(data))
      .catch((err) => console.error("Erreur adresse:", err));
  }, [navigate, userId]);

  const handleChange = (e) => {
    setAdresse({ ...adresse, [e.target.name]: e.target.value });
  };

  const handleAdresseSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://172.17.0.56:8000/api/utilisateur/${userId}/adresse`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adresse),
      });

      if (!response.ok) throw new Error("Erreur mise à jour");

      setSuccessMessage("Adresse mise à jour avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erreur update:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("savedAddress");
    Cookies.remove("isLoggedIn");
    localStorage.removeItem("token");
    window.location.reload();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="account-container">
        <h2>Mon Compte</h2>

        {isAdmin && <p><strong>Status admin :</strong> Oui</p>}

        <h3>Adresse postale</h3>
        <form onSubmit={handleAdresseSubmit}>
          <label>Ville</label>
          <input name="ville" value={adresse.ville || ""} onChange={handleChange} />

          <label>Rue</label>
          <input name="rue" value={adresse.rue || ""} onChange={handleChange} />

          <label>Code Postal</label>
          <input name="cp" value={adresse.cp || ""} onChange={handleChange} />

          <label>Pays</label>
          <input name="pays" value={adresse.pays || ""} onChange={handleChange} />

          <button type="submit" className="save-button">Enregistrer</button>
        </form>

        {successMessage && <p className="success-message">{successMessage}</p>}

        <button onClick={handleLogout} className="logout-button">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

export default Compte;
