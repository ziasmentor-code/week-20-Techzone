import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Backend base URL for images
  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        // Specific order fetch cheyyunnu
        const { data } = await API.get(`/orders/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrderDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading Details...</div>;

  if (!order) {
    return (
      <div className="error-container" style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Order #TZ-{id} Not Found!</h2>
        <p>Ee order id database-il illa. List page-il ninnu click cheythu varuka.</p>
        <button onClick={() => navigate('/my-orders')}>Back to Orders</button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <style>{styles}</style>
      <div className="orders-container">
        <button onClick={() => navigate(-1)} className="back-btn">← Back to Orders</button>
        
        <div className="detail-card">
          <div className="detail-header">
            <div>
              <h1 className="detail-title">Order #TZ-{order.id}</h1>
              <p className="detail-date">Placed on: {new Date(order.created_at).toDateString()}</p>
            </div>
            <span className="status-badge">{order.status}</span>
          </div>

          <div className="items-section">
            <h3 style={{ marginBottom: '20px' }}>Order Items</h3>
            {order.items?.map((item, index) => (
              <div key={index} className="detail-item">
                {/* Product Image Section */}
                <div className="item-image-box">
                  <img 
                    src={item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}`} 
                    alt={item.name} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }} // Image load aayillengil placeholder
                  />
                </div>
                
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-qty">Quantity: {item.quantity}</p>
                  <p className="item-price">Price: ₹{Number(item.price).toLocaleString()}</p>
                </div>
                
                <div className="item-total">
                  ₹{Number(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="detail-footer">
            <div className="total-row">
              <span>Grand Total</span>
              <span>₹{Number(order.total_price).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = `
  .orders-page { min-height: 100vh; background: #f8f7f4; padding: 40px 20px; font-family: 'DM Sans', sans-serif; }
  .orders-container { max-width: 800px; margin: 0 auto; }
  .back-btn { background: none; border: none; color: #888; cursor: pointer; margin-bottom: 20px; font-weight: 600; }
  .detail-card { background: #fff; border-radius: 16px; padding: 32px; border: 1px solid #eee; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
  .detail-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 25px; }
  .detail-title { font-family: 'DM Serif Display', serif; font-size: 1.8rem; margin: 0; }
  .status-badge { background: #fef3c7; color: #b45309; padding: 6px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
  .detail-item { display: flex; align-items: center; gap: 20px; padding: 15px 0; border-bottom: 1px solid #fafafa; }
  .item-image-box { width: 80px; height: 80px; background: #f5f5f5; border-radius: 8px; overflow: hidden; }
  .item-image-box img { width: 100%; height: 100%; object-fit: cover; }
  .item-name { font-weight: 600; margin: 0 0 5px 0; }
  .item-qty, .item-price { font-size: 0.85rem; color: #777; margin: 0; }
  .item-total { margin-left: auto; font-weight: bold; color: #1a1a1a; }
  .detail-footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #f8f7f4; }
  .total-row { display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: bold; }
`;