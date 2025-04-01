import React, { useState, useEffect } from "react";
import "./DosetteTable.css";
import { DosetteTable } from "./DosetteTable.js";

function AdminPanel() {
  DosetteTable();
  const [formData, setFormData] = useState({
    nom: "",
    intensite: "",
    prix: "",
    id_marque: "",
    id_pays: "",
  });
  const [message, setMessage] = useState("");
  const [marques, setMarques] = useState([]);
  const [pays, setPays] = useState([]);
  const [dosetteId, setDosetteId] = useState(null);

  useEffect(() => {
    fetch("http://172.17.0.56:9000/api/marque")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setMarques(data))
      .catch((error) => console.error("Error fetching marques:", error));

    fetch("http://172.17.0.56:9000/api/pays-names")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setPays(data))
      .catch((error) => console.error("Error fetching pays:", error));
  }, []);

  useEffect(() => {
    if (dosetteId) {
      fetchDosetteData(dosetteId);
    }
  }, [dosetteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://172.17.0.56:9000/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Dosette créée avec succès"); // Set success message
        setFormData({
          nom: "",
          intensite: "",
          prix: "",
          id_marque: "",
          id_pays: "",
        }); // Clear form
        setDosetteId(null); // Clear dosette ID
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || "Failed to create dosette"}`); // Set error message
      }
    } catch (error) {
      setMessage("Error: Network error or invalid response");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!dosetteId) {
      setMessage("Veuillez fournir un ID de dosette valide.");
      return;
    }
    try {
      const response = await fetch(
        `http://172.17.0.56:9000/api/update/${dosetteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setMessage("Dosette mise à jour avec succès"); // Set success message
        setFormData({
          nom: "",
          intensite: "",
          prix: "",
          id_marque: "",
          id_pays: "",
        });
        setDosetteId(null);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || "Failed to update dosette"}`);
      }
    } catch (error) {
      setMessage("Error: Network error or invalid response");
    }
  };

  const fetchDosetteData = async (id) => {
    try {
      const response = await fetch(
        `http://172.17.0.56:9000/api/showdosette/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setFormData({
          nom: data.nom,
          intensite: data.intensite,
          prix: data.prix,
          id_marque: data.id_marque,
          id_pays: data.id_pays,
        });
        setMessage("");
      } else {
        setMessage("Erreur lors de la récupération des données de la dosette.");
      }
    } catch (error) {
      setMessage("Error: Network error or invalid response");
    }
  };

  return (
    <div>
      <h2>Gérer une Dosette</h2>
      {message && (
        <div style={{ color: message.includes("Error") ? "red" : "green" }}>
          {message}
        </div>
      )}
      <form onSubmit={dosetteId ? handleUpdate : handleSubmit}>
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
        />
        <input
          type="number"
          name="intensite"
          placeholder="Intensité"
          value={formData.intensite}
          onChange={handleChange}
        />
        <input
          type="number"
          name="prix"
          placeholder="Prix"
          value={formData.prix}
          onChange={handleChange}
        />
        <select
          name="id_marque"
          value={formData.id_marque}
          onChange={handleChange}
        >
          <option value="">Sélectionnez une marque</option>
          {marques.map((marque) => (
            <option key={marque.id} value={marque.id}>
              {marque.nom}
            </option>
          ))}
        </select>
        <select name="id_pays" value={formData.id_pays} onChange={handleChange}>
          <option value="">Sélectionnez un pays</option>
          {pays.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="dosetteId"
          placeholder="ID de la Dosette (pour mise à jour)"
          value={dosetteId || ""}
          onChange={(e) => setDosetteId(e.target.value)}
        />
        <button type="submit" className="action-button modifier-button">
          {dosetteId ? "Mettre à jour Dosette" : "Créer Dosette"}
        </button>
      </form>{" "}
      <DosetteTable />
    </div>
  );
}

export default AdminPanel;
