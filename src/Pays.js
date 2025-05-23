// src/Pays.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pays.css";

function Pays() {
  const [paysData, setPaysData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://172.17.0.56:8000/api/pays")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des pays.");
        return res.json();
      })
      .then((data) => {
        setPaysData(data);
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
    <div className="pays-container">
           <button className="back-button" onClick={() => navigate(-1)}>
         Retour
      </button>
      <h2>Liste des pays</h2>
      <div className="pays-grid">
        {paysData.map((pays, index) => (
          <div key={index} className="pays-card">
            <h3>{pays.nom}</h3>
            <p><strong>Continent :</strong> {pays.continent}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pays;
