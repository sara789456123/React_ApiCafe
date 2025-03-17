import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ModifierDosette() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dosette, setDosette] = useState({
    nom: '',
    intensite: '',
    prix: '',
    marque: '',
    pays: '',
    id_marque: '', 
    id_pays: '',   
  });

  useEffect(() => {
  
    fetch(`http://172.17.0.56:8000/api/showdosette/${id}`)
      .then(response => response.json())
      .then(data => {
      
        setDosette({
          nom: data.nom,
          intensite: data.intensite,
          prix: data.prix,
          marque: data.marque,
          pays: data.pays,     
          id_marque: data.id_marque, 
          id_pays: data.id_pays,   
        });
      })
      .catch(error => console.error('Error fetching dosette:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDosette((prevDosette) => ({
      ...prevDosette,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://172.17.0.56:8000/api/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: dosette.nom,
          intensite: dosette.intensite,
          prix: dosette.prix,
          id_marque: dosette.id_marque, 
          id_pays: dosette.id_pays,   
        }),
      });

      if (response.ok) {
        navigate('/');
      } else {
        console.error('Error updating dosette');
      }
    } catch (error) {
      console.error('Error updating dosette:', error);
    }
  };

  return (
    <div>
      <h2>Modifier Dosette</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={dosette.nom}
          onChange={handleChange}
        />
        <input
          type="number"
          name="intensite"
          placeholder="Intensité"
          value={dosette.intensite}
          onChange={handleChange}
        />
        <input
          type="number"
          name="prix"
          placeholder="Prix"
          value={dosette.prix}
          onChange={handleChange}
        />
        <input
          type="text"
          name="marque"
          placeholder="Marque"
          value={dosette.marque}
          onChange={handleChange}
          readOnly 
        />
        <input
          type="text"
          name="pays"
          placeholder="Pays"
          value={dosette.pays}
          onChange={handleChange}
          readOnly 
        />
        <input
          type="hidden"
          name="id_marque"
          value={dosette.id_marque}
          onChange={handleChange}
        />
        <input
          type="hidden"
          name="id_pays"
          value={dosette.id_pays}
          onChange={handleChange}
        />
        <button type="submit" className="action-button modifier-button">Modifier</button>
      </form>
    </div>
  );
}

export default ModifierDosette;
