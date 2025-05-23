import React, { useEffect, useState } from "react";
import "./HistoriqueCommande.css";

function HistoriqueCommandes() {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const fetchHistorique = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setErreur("Utilisateur non connecté.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://172.17.0.56:8000/api/utilisateur/${userId}/factures-produits`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des commandes.");
        }

        const data = await response.json();
        setHistorique(data.factures || []);
      } catch (err) {
        console.error("Erreur :", err);
        setErreur(err.message || "Erreur inattendue.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (erreur) return <p>{erreur}</p>;

  return (
    <div className="historique-container">
      <h2>Historique des Commandes</h2>
      {historique.length === 0 ? (
        <p>Aucune commande passée.</p>
      ) : (
        <table className="historique-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total</th>
              <th>Articles</th>
            </tr>
          </thead>
          <tbody>
            {historique.map((commande, index) => (
              <tr key={index}>
                <td>{commande.date_facturation}</td>
                <td>{Number(commande.prixTTC_commande).toFixed(2)} €</td>
                <td>
                  <ul className="articles-list">
                    {commande.produits.map((article, idx) => (
                      <li key={idx}>
                        {article.nom_produit} - {article.nb_produit} × {parseFloat(article.prix_unitaire).toFixed(2)} €
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HistoriqueCommandes;
