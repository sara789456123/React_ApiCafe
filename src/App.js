import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import DosetteTable from "./DosetteTable";
import Login from "./Login";
import ModifierDosette from "./Admin/ModifierDosette";
import AdminPanel from "./Admin/AdminPanel";
import Panier from "./Client/Panier";
import HistoriqueCommandes from "./Client/HistoriqueCommandes";
import Compte from "./Client/Compte";
import Paiement from "./Client/Paiement";
import Marques from "./Marques";
import Pays from "./Pays";

import "./App.css";
import { UserProvider } from "./utils/context";
import { UserContext } from "./utils/context";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://172.17.0.56:8000/api/check-token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isAdmin !== undefined) {
            console.log("isAdmin:", data.isAdmin);
            setIsAdmin(data.isAdmin);
          }
        })
        .catch((error) => {
          console.error("Error checking token:", error);
        });
    }
  }, []);
  return (
    <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<DosetteTable />} />
          <Route path="/AdminPanel" element={<AdminPanel />} />


          <Route path="/panier" element={<Panier />} />
          <Route path="/login" element={<Login />} />
          <Route path="/compte" element={<Compte />} />
          <Route path="/paiement" element={<Paiement />} />
          <Route path="/modifier/:id" element={<ModifierDosette />} />
          <Route path="/historique" element={<HistoriqueCommandes />} />
          <Route path="/pays" element={<Pays />} />
          <Route path="/marques" element={<Marques />} />
        </Routes>
    </div>
  );
}

export default App;
