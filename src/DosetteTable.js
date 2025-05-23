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
    const updatedConfig = {
      ...sortConfig,
      [name]: value,
    };
    setSortConfig(updatedConfig);

    if (value) {
      fetchDosettes(`http://172.17.0.56:8000/api/dosettes/sort?order=${value}`);
    } else {
      fetchDosettes("http://172.17.0.56:8000/api/all");
    }
  };

  const handleAddToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  };

  const updateCartDisplay = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCountElement = document.querySelector(".total-count");
    const totalCartElement = document.querySelector(".total-cart");
    const showCartElement = document.querySelector(".show-cart tbody");

    if (totalCountElement && totalCartElement && showCartElement) {
      totalCountElement.textContent = cart.length;
      const totalPrice = cart.reduce(
        (total, item) => total + parseFloat(item.prix),
        0
      );
      totalCartElement.textContent = totalPrice.toFixed(2);

      showCartElement.innerHTML = cart
        .map(
          (item) => `
        <tr>
          <td>${item.nom}</td>
          <td>${item.prix}</td>
        </tr>
      `
        )
        .join("");
    }
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

  useEffect(() => {
    updateCartDisplay();
  }, []);

  return (
    <div>
      <div className="container dosette-container">
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
          <select
            name="pays"
            value={filters.pays}
            onChange={handleFilterChange}
          >
            <option value="">Pays</option>
            {paysOptions.map((pays) => (
              <option key={pays.id} value={pays.nom}>
                {pays.nom}
              </option>
            ))}
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
          <button className="display-button" onClick={showPays}>
            Afficher les Pays
          </button>
          <button className="display-button" onClick={showMarques}>
            Afficher les Marques
          </button>
              </div>
    <div className="row dosette-cards">
      {displayData.map((item) => (
        <div key={item.id} className="col-md-4">
          <div className="card dosette-card">
            <div className="card-body d-flex">
              <img
                className="card-img-left"
                src={
                  item.id
                    ? `/images/${item.id}.png`
                    : '/images/default.png' 
                }
                alt={item.nom || 'Dosette'}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/default.png';
                }}
              />
              <div className="card-details">
                  <h4 className="card-title">{item.nom}</h4>
                  <p className="card-price">
                    Prix: {item.prix !== null ? item.prix : "N/A"}&euro;
                  </p>
                  <p className="card-text-small">
                      Intensité:{" "}
                      {item.intensite !== null ? item.intensite : "N/A"}
                    </p>
                    <p className="card-text-small">Marque: {item.marque}</p>
                    <p className="card-text-small">Pays: {item.pays}</p>
                    <button
                      className="ajouter-button"
                      onClick={() => handleAddToCart(item)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DosetteTable;
