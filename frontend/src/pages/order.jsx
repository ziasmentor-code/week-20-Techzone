import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const BASE_URL = "http://127.0.0.1:8000";

const STATUS_CONFIG = {
  Pending: { color: "#f59e0b", step: 1 },
  Processing: { color: "#f59e0b", step: 1 },
  Shipped: { color: "#38bdf8", step: 2 },
  Delivered: { color: "#34d399", step: 3 },
  Cancelled: { color: "#f87171", step: 0 },
};

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/");
        setOrders(data);
      } catch (err) {
        console.error("Order load error:", err.response);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loader}></div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>My Orders</h1>

      {orders.length === 0 ? (
        <p style={{ color: "#888" }}>No orders found.</p>
      ) : (
        orders.map((order) => {
          // ✅ 1. DYNAMIC STATUS LOGIC
          const rawStatus = order.status || "Pending";
          const formattedStatus =
            rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
          const cfg = STATUS_CONFIG[formattedStatus] || STATUS_CONFIG.Pending;

          // ✅ 2. DYNAMIC IMAGE LOGIC
          const firstItem = order.items?.[0];
          // Django models-il saadharana 'product_image' allengil 'image' ennaanu field name varaaru
          const imgPath = firstItem?.product_image || firstItem?.image || firstItem?.product?.image;

          let fullImgUrl = "";
          if (imgPath) {
            // Path-inte mumpil slash illengil athu add cheyyunnu
            const cleanPath = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
            fullImgUrl = imgPath.startsWith("http")
              ? imgPath
              : `${BASE_URL}${cleanPath}`;
          }

          return (
            <div key={order.id} style={styles.card}>
              <div style={styles.leftSection}>
                <div style={styles.imgBox}>
                  {imgPath ? (
                    <img
                      src={fullImgUrl}
                      alt="Product"
                      style={styles.image}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/70?text=📦";
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: "28px" }}>📦</div>
                  )}
                </div>

                <div>
                  <h4 style={styles.orderId}>#TZ-{order.id}</h4>
                  <p style={styles.date}>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </div>

              <div style={styles.middle}>
                <p style={styles.price}>
                  ₹{Number(order.total_price || 0).toLocaleString("en-IN")}
                </p>
                {/* ✅ DISPLAY DYNAMIC STATUS (NOT HARDCODED) */}
                <p style={{ color: cfg.color, fontWeight: "bold", marginTop: "5px" }}>
                  {formattedStatus}
                </p>
              </div>

              <div style={styles.buttons}>
                <button
                  style={styles.detailsBtn}
                  onClick={() => navigate(`/my-orders/${order.id}`)}
                >
                  Details
                </button>

                <button
                  style={{
                    ...styles.trackBtn,
                    background: cfg.color,
                  }}
                  onClick={() => navigate(`/track-order/${order.id}`)}
                >
                  Track
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0c0c0f", padding: "60px 20px", color: "#fff", fontFamily: "sans-serif" },
  title: { fontSize: "2rem", marginBottom: "30px" },
  card: { background: "#141418", border: "1px solid #222", borderRadius: "12px", padding: "20px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  leftSection: { display: "flex", alignItems: "center", gap: "15px" },
  imgBox: { width: "70px", height: "70px", background: "#1e1e24", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  orderId: { margin: 0 },
  date: { fontSize: "0.8rem", color: "#777" },
  middle: { textAlign: "center" },
  price: { fontSize: "1.2rem", fontWeight: "bold", margin: 0 },
  buttons: { display: "flex", gap: "10px" },
  detailsBtn: { padding: "6px 14px", borderRadius: "6px", border: "none", background: "#333", color: "#fff", cursor: "pointer" },
  trackBtn: { padding: "6px 14px", borderRadius: "6px", border: "none", color: "#000", cursor: "pointer" },
  loading: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0c0c0f" },
  loader: { width: "40px", height: "40px", border: "4px solid #222", borderTop: "4px solid #f59e0b", borderRadius: "50%", animation: "spin 1s linear infinite" },
};