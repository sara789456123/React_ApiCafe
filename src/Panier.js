import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [login, setLogin] = useState("");
  const [mdp, setMdp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://172.17.0.56:9000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, mdp }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/?admin=${data.admin}`); // Append admin status to URL
      } else {
        setError("Identifiants invalides");
      }
    } catch (error) {
      setError("Erreur de connexion");
    }
  };

  return (
    <div>
      <h2>Votre Panier</h2>
      <h3>Vous n'avez aucun article dans votre panier</h3>
      <table></table>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
