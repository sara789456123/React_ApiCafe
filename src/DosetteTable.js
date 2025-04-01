import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DosetteTable.css";

export function DosetteTable() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const [isDisplayingAllDosettes, setIsDisplayingAllDosettes] = useState(true);

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
    fetchDosettes("http://172.17.0.56:9000/api/all");
    fetchOptions("http://172.17.0.56:9000/api/pays-names", setPaysOptions);
    fetchOptions("http://172.17.0.56:9000/api/marque", setMarqueOptions);
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
      `http://172.17.0.56:9000/api/filter?${queryParams.toString()}`
    );
  };

  const showPays = () => {
    setDisplayData(
      paysOptions.map((pays) => ({
        id: pays.id,
        nom: pays.pays,
        intensite: null,
        prix: null,
        marque: null,
        pays: pays.continent,
      }))
    );
    setIsDisplayingAllDosettes(false);
  };

  const showMarques = () => {
    setDisplayData(
      marqueOptions.map((marque) => ({
        id: marque.id,
        nom: marque.nom,
        intensite: null,
        prix: null,
        marque: "N/A",
        pays: "N/A",
      }))
    );
    setIsDisplayingAllDosettes(false);
  };

  const showAllDosettes = () => {
    fetchDosettes("http://172.17.0.56:9000/api/all");
    setIsDisplayingAllDosettes(true);
  };

  const handleSortChange = (e) => {
    const { name, value } = e.target;
    setSortConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
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
        `http://172.17.0.56:9000/api/dosettes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchDosettes("http://172.17.0.56:9000/api/all");
      } else {
        console.error("Error deleting dosette");
      }
    } catch (error) {
      console.error("Error deleting dosette:", error);
    }
  };

  return (
    <div className="table-container">
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
          placeholder="Intensitéx Min"
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
      </div>
      <div className="display-buttons">
        <button className="display-button" onClick={showAllDosettes}>
          Toutes les Dosettes
        </button>
        <button className="display-button" onClick={showPays}>
          Afficher les Pays
        </button>
        <button className="display-button" onClick={showMarques}>
          Afficher les Marques
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Intensit�</th>
            <th>Prix</th>
            <th>Marque</th>
            <th>Pays</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortData().map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nom}</td>
              <td>{item.intensite !== null ? item.intensite : "N/A"}</td>
              <td>{item.prix !== null ? item.prix : "N/A"}</td>
              <td>{item.marque}</td>
              <td>{item.pays}</td>
              <td>
                {isDisplayingAllDosettes && (
                  <>
                    <button
                      className="action-button ajouter-button"
                      onClick={() => navigate(`/ajouter/${item.id}`)}
                    >
                      Ajouter au panier
                    </button>
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
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DosetteTable;
