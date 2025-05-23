// src/Marques.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Marques.css"; // Crée ce fichier pour les styles

function Marques() {
  const [marquesData, setMarquesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://172.17.0.56:8000/api/marque")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des marques.");
        return res.json();
      })
      .then((data) => {
        setMarquesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="marques-container">
         <button className="back-button" onClick={() => navigate(-1)}>
       Retour
      </button>
      <h2>Liste des Marques</h2>
      <div className="marques-grid">
        {marquesData.map((marque) => (
          <div key={marque.id} className="marque-card">
            <h3>{marque.nom}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marques;
