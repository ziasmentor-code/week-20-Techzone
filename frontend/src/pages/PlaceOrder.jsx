// PlaceOrder.jsx
import React, { useState } from "react";

const BASE_URL = "http://127.0.0.1:8000";

export default function PlaceOrder() {
  const [orderId, setOrderId] = useState(1); // order ID
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/orders/place/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ /* order details */ }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
      console.log("Order placed:", data);
    } catch (err) {
      console.error("Place order error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", color: "#fff", fontFamily: "sans-serif" }}>
      <h2>Place Order</h2>
      <input
        type="number"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button onClick={handlePlaceOrder} style={{ padding: "8px 16px" }}>
        {loading ? "Placing..." : "Place Order"}
      </button>

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h4>Response:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}