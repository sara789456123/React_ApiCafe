import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Panier.css";

function Panier() {
  const [cart, setCart] = useState([]);
  const [paymentMessage, setPaymentMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
const handlePayment = async () => {
  console.log("Début handlePayment");

  const total = cart.reduce(
    (acc, item) => acc + (item.prix || 0) * (item.quantity || 1),
    0
  );
  const date = new Date().toISOString().split("T")[0];
  const userId = localStorage.getItem("userId");

  try {
  const endpoint = `http://172.17.0.56:8000/api/utilisateur/${userId}/commande`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prixTTC: total,
        date_facturation: date,
        produits: cart.map(item => ({
          id_produit: item.id,
          nb_produit: item.quantity,
          prix_unitaire: item.prix,
        })),
      }),
    });
    if (!response.ok) throw new Error("Erreur lors de l'enregistrement de la commande");
    setPaymentMessage("Commande enregistrée avec succès !");
    localStorage.removeItem("cart");
    navigate("/paiement");
  } catch (error) {
    console.error("Erreur de paiement :", error);
    alert("Erreur lors du traitement de la commande.");
  }
};

 const handleRemoveItem = (itemId) => { //enleve les items dans panier
      const updatedCart = cart.filter((item) => item.id !== itemId);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.prix || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="panier-container">
      <h2>Votre Panier</h2>
      {paymentMessage ? (
        <h3>{paymentMessage}</h3>
      ) : cart.length === 0 ? (
        <h3>Vous n'avez aucun article dans votre panier</h3>
      ) : (
        <>
              <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Nombre</th>
            <th>Prix</th>
            <th></th> {}
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.nom}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.quantity || 1}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value))
                  }
                />
              </td>
              <td>
                {item.prix !== null
                  ? (item.prix * (item.quantity || 1)).toFixed(2)
                  : "N/A"}
                &euro;
              </td>
              <td>
                <button onClick={() => handleRemoveItem(item.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          <h3>Total: {totalPrice.toFixed(2)} &euro;</h3>
        </>
  
      )}
      {cart.length > 0 && (
        <button className="payment-button" onClick={handlePayment}>
          Payer
        </button>
      )}
    </div>
  );
}

export default Panier;
