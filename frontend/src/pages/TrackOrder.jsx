import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await API.get(`/orders/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(data);
      } catch (err) {
        console.error("Tracking fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) return <div className="loading">Tracking your package...</div>;
  if (!order) return <div>Order not found!</div>;

  return (
    <div className="track-container">
      <style>{trackStyles}</style>
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      
      <div className="track-card">
        <h2>Track Order #TZ-{order.id}</h2>
        <p className="current-status">Status: <span>{order.status}</span></p>
        
        <div className="timeline">
          <div className={`step ${['Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'active' : ''}`}>
            <div className="circle">1</div>
            <p>Order Processed</p>
          </div>
          <div className={`step ${['Shipped', 'Delivered'].includes(order.status) ? 'active' : ''}`}>
            <div className="circle">2</div>
            <p>Shipped</p>
          </div>
          <div className={`step ${order.status === 'Delivered' ? 'active' : ''}`}>
            <div className="circle">3</div>
            <p>Delivered</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const trackStyles = `
  .track-container { padding: 40px; background: #0c0c0f; min-height: 100vh; color: #fff; font-family: sans-serif; }
  .back-btn { background: none; border: 1px solid #333; color: #888; padding: 8px 16px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }
  .track-card { background: #141418; padding: 30px; border-radius: 20px; border: 1px solid #222; text-align: center; }
  .current-status span { color: #f59e0b; font-weight: bold; }
  .timeline { display: flex; justify-content: space-between; margin-top: 50px; position: relative; }
  .timeline::before { content: ''; position: absolute; top: 20px; left: 10%; right: 10%; height: 2px; background: #222; z-index: 1; }
  .step { z-index: 2; flex: 1; }
  .circle { width: 40px; height: 40px; background: #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; border: 2px solid #333; }
  .step.active .circle { background: #f59e0b; border-color: #f59e0b; color: #000; font-weight: bold; }
  .step.active p { color: #f59e0b; }
  .step p { font-size: 0.8rem; color: #555; }
`;