import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Paiement.css";

function AdresseForm() {
  const [adresse, setAdresse] = useState({
    ville: "",
    rue: "",
    cp: "",
    pays: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAdresse = async () => {
      try {
        const response = await fetch(`http://172.17.0.56:8000/api/utilisateur/${userId}/adresse`);
        if (!response.ok) throw new Error("Erreur de récupération de l'adresse");

        const data = await response.json();
        setAdresse(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'adresse :", error);
      }
    };

    fetchAdresse();
  }, [userId]);

  const handleChange = (e) => {
    setAdresse({ ...adresse, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://172.17.0.56:8000/api/utilisateur/${userId}/adresse`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adresse),
      });

      if (!response.ok) throw new Error("Échec de la mise à jour");

      setSuccessMessage("Adresse mise à jour avec succès !");
      setTimeout(() => {
        navigate("/historique");
      }, 2000);
    } catch (error) {
      console.error("Erreur mise à jour :", error);
    }
  };

  return (
    <div className="container">
      <form className="payment-container" onSubmit={handleSubmit}>
        <h2>Modifier l'adresse</h2>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="form-group">
          <label>Ville:</label>
          <input
            className="payment-input"
            name="ville"
            value={adresse.ville || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Rue:</label>
          <input
            className="payment-input"
            name="rue"
            value={adresse.rue || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Code Postal:</label>
          <input
            className="payment-input"
            name="cp"
            value={adresse.cp || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Pays:</label>
          <input
            className="payment-input"
            name="pays"
            value={adresse.pays || ""}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="payment-button">
          Enregistrer
        </button>
      </form>
    </div>
  );
}

export default AdresseForm;
