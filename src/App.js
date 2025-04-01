import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import DosetteTable from "./DosetteTable";
import AdminPanel from "./AdminPanel";
import Login from "./Login";
import ModifierDosette from "./ModifierDosette";
import Panier from "./Panier";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<DosetteTable />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/Panier" element={<Panier />} />
          <Route path="/login" element={<Login />} />
          <Route path="/modifier/:id" element={<ModifierDosette />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
