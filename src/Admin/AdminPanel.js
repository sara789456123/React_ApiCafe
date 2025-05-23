import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminPanel.css";

export function DosetteTable() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const [isDisplayingAllDosettes, setIsDisplayingAllDosettes] = useState(true);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const [dosettes, setDosettes] = useState([]);
  const [filters, setFilters] = useState({
    prixMin: "",
    prixMax: "",
    intensiteMin: "",
    intensiteMax: "",
    marque: "",
    pays: "",
  });
  const [paysOptions, setPaysOptions] = useState([]);
  const [marqueOptions, setMarqueOptions] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "",
  });

  const [newDosette, setNewDosette] = useState({
    nom: "",
    intensite: "",
    prix: "",
    id_marque: "",
    id_pays: "",
  });

  const fetchDosettes = (url) => {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDosettes(data);
        setDisplayData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const fetchOptions = (url, setOptions) => {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setOptions(data))
      .catch((error) => console.error("Error fetching options:", error));
  };

  useEffect(() => {
    fetchDosettes("http://172.17.0.56:8000/api/all");
    fetchOptions("http://172.17.0.56:8000/api/pays-names", setPaysOptions);
    fetchOptions("http://172.17.0.56:8000/api/marque", setMarqueOptions);
  }, [token]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    const queryParams = new URLSearchParams();
    if (filters.prixMin !== "") queryParams.append("prixMin", filters.prixMin);
    if (filters.prixMax !== "") queryParams.append("prixMax", filters.prixMax);
    if (filters.intensiteMin !== "")
      queryParams.append("intensiteMin", filters.intensiteMin);
    if (filters.intensiteMax !== "")
      queryParams.append("intensiteMax", filters.intensiteMax);
    if (filters.marque !== "") queryParams.append("marque", filters.marque);
    if (filters.pays !== "") queryParams.append("pays", filters.pays);

    fetchDosettes(
      `http://172.17.0.56:8000/api/filter?${queryParams.toString()}`
    );
  };

  const showPays = () => {
  navigate('/pays');
};

  const showMarques = () => {
   navigate('/marques');
  };

  const handleSortChange = (e) => {
    const { name, value } = e.target;
    setSortConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/panier");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDosette((prevDosette) => ({
      ...prevDosette,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://172.17.0.56:8000/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDosette),
      });

      if (response.ok) {
        fetchDosettes("http://172.17.0.56:8000/api/all");
        setShowModal(false); // Close the modal on successful submission
        setNewDosette({
          nom: "",
          intensite: "",
          prix: "",
          id_marque: "",
          id_pays: "",
        }); // Reset form
      } else {
        console.error("Error adding dosette");
      }
    } catch (error) {
      console.error("Error adding dosette:", error);
    }
  };

  const sortData = () => {
    if (!sortConfig.key || !sortConfig.direction) return displayData;

    return [...displayData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://172.17.0.56:8000/api/dosettes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchDosettes("http://172.17.0.56:8000/api/all");
      } else {
        console.error("Error deleting dosette");
      }
    } catch (error) {
      console.error("Error deleting dosette:", error);
    }
  };

  return (
    <div className="dosette-container">
      <div className="filters">
        <input
          type="number"
          name="prixMin"
          placeholder="Prix Min"
          value={filters.prixMin}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="prixMax"
          placeholder="Prix Max"
          value={filters.prixMax}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="intensiteMin"
          placeholder="Intensité Min"
          value={filters.intensiteMin}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="intensiteMax"
          placeholder="Intensité Max"
          value={filters.intensiteMax}
          onChange={handleFilterChange}
        />
        <select
          name="marque"
          value={filters.marque}
          onChange={handleFilterChange}
        >
          <option value="">Marques</option>
          {marqueOptions.map((marque) => (
            <option key={marque.id} value={marque.nom}>
              {marque.nom}
            </option>
          ))}
        </select>
        <select name="pays" value={filters.pays} onChange={handleFilterChange}>
          <option value="">Pays</option>
          {paysOptions.map((pays) => (
            <option key={pays.id} value={pays.nom}>
              {pays.nom}
            </option>
          ))}
        </select>
        <select name="key" value={sortConfig.key} onChange={handleSortChange}>
          <option value="">Trier par</option>
          <option value="pays">Pays</option>
          <option value="marque">Marque</option>
          <option value="continent">Continent</option>
        </select>
        <select
          name="direction"
          value={sortConfig.direction}
          onChange={handleSortChange}
        >
          <option value="">Ordre</option>
          <option value="asc">Ascendant</option>
          <option value="desc">Descendant</option>
        </select>
        <button onClick={applyFilters} className="display-button">
          Appliquer les Filtres
        </button>
        <button className="display-button" onClick={showPays}>
          Afficher les Pays
        </button>
        <button className="display-button" onClick={showMarques}>
          Afficher les Marques
        </button>
      </div>
      <div className="display-buttons">
        <button
          className="display-button-ajouter"
          onClick={() => setShowModal(true)}
        >
          Ajouter Dosette
        </button>
      </div>
  <div className="dosette-cards">
    {sortData().map((item) => (
      <div key={item.id} className="dosette-card">
        <img
          className="card-img-left"
          src={
            item.id
              ? `/images/${item.id}.png`
              : '/images/default.png' // default image
          }
          alt={item.nom || 'Dosette'}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop if default image also fails
            e.target.src = '/images/default.png';
          }}
        />
        <div className="dosette-details">
          <h3>{item.nom}</h3>
          <p>Intensité: {item.intensite !== null ? item.intensite : "N/A"}</p>
          <p>Prix: {item.prix !== null ? item.prix : "N/A"} €</p>
          <p>Marque: {item.marque}</p>
          <p>Pays: {item.pays}</p>

        {isDisplayingAllDosettes && (
          <div className="dosette-actions">
            <button
              className="action-button modifier-button"
              onClick={() => navigate(`/modifier/${item.id}`)}
            >
              Modifier
            </button>
            <button
              className="action-button supprimer-button"
              onClick={() => handleDelete(item.id)}
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  ))}
</div>
      {/* Modal new dosette */}
      {showModal && (
        <div className="modal">
          <div className="modal-content admin-panel">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Ajouter une Dosette</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom:</label>
                <input
                  type="text"
                  name="nom"
                  value={newDosette.nom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Intensité:</label>
                <input
                  type="number"
                  name="intensite"
                  value={newDosette.intensite}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Prix:</label>
                <input
                  type="number"
                  name="prix"
                  value={newDosette.prix}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Marque:</label>
                <select
                  name="id_marque"
                  value={newDosette.id_marque}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Marque</option>
                  {marqueOptions.map((marque) => (
                    <option key={marque.id} value={marque.id}>
                      {marque.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Pays:</label>
                <select
                  name="id_pays"
                  value={newDosette.id_pays}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Pays</option>
                  {paysOptions.map((pays) => (
                    <option key={pays.id} value={pays.id}>
                      {pays.nom}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="display-button-ajouter">
                Ajouter
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DosetteTable;
