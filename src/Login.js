import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Login.css";
import { UserContext } from "./utils/context";
import eyeIcon from "./img/eye.png";
import eyeOpenIcon from "./img/eye-open.png";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // État pour suivre la visibilité du mot de passe
  const { isAdmin, setIsAdmin } = useContext(UserContext);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(UserContext);
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // Étape 1 : Login
    const response = await fetch("http://172.17.0.56:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
        body: JSON.stringify({ login: email, mdp: password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();

    if (!data.token) {
      alert("Login échoué : token manquant.");
      return;
    }

    // Étape 2 : Stocker le token
    const token = data.token;
    localStorage.setItem("token", token);

    // Étape 3 : Vérifier le token via /check-token
    const checkResponse = await fetch("http://172.17.0.56:8000/api/check-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!checkResponse.ok) throw new Error("Échec de la vérification du token");

    const checkData = await checkResponse.json();

    // Stockage infos utilisateur
    localStorage.setItem("userId", checkData.userId);
    localStorage.setItem("isAdmin", checkData.isAdmin === 1 ? "1" : "0");

    Cookies.set("isLoggedIn", "true");
    setIsLoggedIn(true);
    setIsAdmin(checkData.isAdmin === 1);

    navigate("/");
  } catch (error) {
    console.error("Erreur lors du login :", error);
    alert("Login échoué. Vérifie tes identifiants.");
  }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div className="login-container">
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="toto@gmail.com"
              className="login-input"
            />
          </div>
          <div className="form-group">
            <label>Mot de Passe:</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="toto123"
                className="login-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{ marginLeft: "10px", background: "none", border: "none", cursor: "pointer" }}
              >
                <img
                  src={showPassword ? eyeOpenIcon : eyeIcon}
                  alt={showPassword ? "Hide password" : "Show password"}
                  style={{ width: "20px", height: "20px" }}
                />
              </button>
            </div>
          </div>
          <button type="submit" className="login-button">
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
