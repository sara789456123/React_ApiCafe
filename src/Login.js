import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [login, setLogin] = useState('');
  const [mdp, setMdp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://172.17.0.56:9000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, mdp }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/?admin=${data.admin}`); // Append admin status to URL
      } else {
        setError('Identifiants invalides');
      }
    } catch (error) {
      setError('Erreur de connexion');
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
        />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
