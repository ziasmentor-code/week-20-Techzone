import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const STATUS_CONFIG = {
  Processing: { color: '#b45309', bg: '#fef3c7', label: 'Processing' },
  Shipped:    { color: '#0369a1', bg: '#e0f2fe', label: 'Shipped' },
  Delivered:  { color: '#15803d', bg: '#dcfce7', label: 'Delivered' },
  Cancelled:  { color: '#b91c1c', bg: '#fee2e2', label: 'Cancelled' },
};

const TRACKING_STEPS = [
  {
    key: 'placed',
    label: 'Order Placed',
    desc: 'Your order has been received',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    key: 'processing',
    label: 'Processing',
    desc: 'Your order is being prepared',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    key: 'shipped',
    label: 'Shipped',
    desc: 'Your order is on the way',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    key: 'delivered',
    label: 'Delivered',
    desc: 'Enjoy your purchase!',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
];

const STATUS_STEP_MAP = {
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: -1,
};

function TrackingTimeline({ status }) {
  const currentStep = STATUS_STEP_MAP[status] ?? 1;
  const isCancelled = status === 'Cancelled';

  if (isCancelled) {
    return (
      <div className="tracking-cancelled">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        This order was cancelled.
      </div>
    );
  }

  return (
    <div className="tracking-timeline">
      {TRACKING_STEPS.map((step, idx) => {
        const done = idx <= currentStep;
        const active = idx === currentStep;
        return (
          <div key={step.key} className="tracking-step">
            {idx > 0 && <div className={`track-line ${idx <= currentStep ? 'done' : ''}`} />}
            <div className={`track-dot ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
              {done ? step.icon : <span className="track-num">{idx + 1}</span>}
            </div>
            <div className="track-text">
              <p className={`track-label ${done ? 'done' : ''}`}>{step.label}</p>
              <p className="track-desc">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [trackingOpen, setTrackingOpen] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await API.get('/orders/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (err) {
        console.error("Orders fetching failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleOrder = (id) => setExpanded(prev => prev === id ? null : id);
  const toggleTracking = (id) => setTrackingOpen(prev => ({ ...prev, [id]: !prev[id] }));

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="orders-page">
          <div className="orders-container">
            <div className="skeleton-header" />
            {[1, 2, 3].map(i => <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 100}ms` }} />)}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="orders-page">
        <div className="orders-container">

          <div className="orders-header">
            <div>
              <h1 className="orders-title">My Orders</h1>
              <p className="orders-sub">{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                </svg>
              </div>
              <h2 className="empty-title">No orders yet</h2>
              <p className="empty-sub">Your order history will appear here once you place an order.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order, i) => {
                const status = order.status || 'Processing';
                const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Processing;
                const isOpen = expanded === order.id;
                const isTracking = trackingOpen[order.id];
                const date = new Date(order.created_at);

                return (
                  <div key={order.id} className={`order-card ${isOpen ? 'open' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>

                    {/* Main Row */}
                    <div className="order-row" onClick={() => toggleOrder(order.id)}>
                      <div className="order-left">
                        <div className="order-id-wrap">
                          <span className="order-id">#TZ-{order.id}</span>
                          <span className="status-chip" style={{ color: cfg.color, background: cfg.bg }}>
                            <span className="status-dot" style={{ background: cfg.color }} />
                            {cfg.label}
                          </span>
                        </div>
                        <div className="order-meta">
                          <span className="meta-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {order.shippingAddress && (
                            <span className="meta-item">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                              </svg>
                              {order.shippingAddress}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="order-right">
                        <p className="order-amount">₹{Number(order.total_price).toLocaleString()}</p>
                        <div className={`chevron ${isOpen ? 'up' : ''}`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                      </div>
                    </div>

                    {/* Expanded */}
                    {isOpen && (
                      <div className="order-expanded">
                        <div className="items-divider" />

                        {/* Track Toggle */}
                        <div className="track-toggle-wrap">
                          <button
                            className={`track-toggle-btn ${isTracking ? 'active' : ''}`}
                            onClick={() => toggleTracking(order.id)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {isTracking ? 'Hide Tracking' : 'Track Order'}
                            <div className={`chevron-sm ${isTracking ? 'up' : ''}`}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                            </div>
                          </button>
                        </div>

                        {/* Timeline */}
                        {isTracking && (
                          <div className="tracking-wrap">
                            <TrackingTimeline status={status} />
                          </div>
                        )}

                        <div className="items-divider" />

                        {/* Items */}
                        {order.items && order.items.map((item, idx) => (
                          <div key={idx} className="order-item">
                            <div className="order-item-img">
                              {item.image ? (
                                <img src={item.image?.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`} alt={item.name} />
                              ) : (
                                <div className="img-placeholder">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                                </div>
                              )}
                            </div>
                            <div className="order-item-info">
                              <p className="order-item-name">{item.name}</p>
                              <p className="order-item-qty">Qty: {item.quantity}</p>
                            </div>
                            <p className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}

                        <div className="items-total">
                          <span>Order Total</span>
                          <span>₹{Number(order.total_price).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

  .orders-page { min-height: 100vh; background: #f8f7f4; padding: 48px 20px 80px; font-family: 'DM Sans', sans-serif; }
  .orders-container { max-width: 860px; margin: 0 auto; }

  .orders-header { margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1.5px solid #e5e2db; }
  .orders-title { font-family: 'DM Serif Display', serif; font-size: 2.4rem; color: #1a1a1a; margin: 0 0 4px 0; line-height: 1; }
  .orders-sub { font-size: 0.9rem; color: #888; margin: 0; }

  .orders-list { display: flex; flex-direction: column; gap: 10px; }

  .order-card {
    background: #fff; border-radius: 14px; overflow: hidden;
    animation: slideUp 0.35s ease both;
    border: 1.5px solid transparent;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .order-card.open { border-color: #e5e2db; box-shadow: 0 4px 24px rgba(0,0,0,0.05); }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .order-row { display: flex; justify-content: space-between; align-items: center; padding: 22px 24px; cursor: pointer; gap: 16px; transition: background 0.15s; }
  .order-row:hover { background: #fafaf8; }
  .order-left { flex: 1; min-width: 0; }

  .order-id-wrap { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
  .order-id { font-weight: 700; font-size: 0.95rem; color: #1a1a1a; font-family: 'DM Serif Display', serif; }

  .status-chip { display: inline-flex; align-items: center; gap: 5px; font-size: 0.75rem; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; }

  .order-meta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .meta-item { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: #aaa; max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .order-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
  .order-amount { font-size: 1.15rem; font-weight: 700; color: #1a1a1a; margin: 0; }

  .chevron { color: #bbb; transition: transform 0.25s ease; }
  .chevron.up { transform: rotate(180deg); }

  .order-expanded { animation: fadeIn 0.25s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

  .items-divider { height: 1.5px; background: #f0eeeb; margin: 0 24px; }

  /* Track Toggle */
  .track-toggle-wrap { padding: 16px 24px 12px; }
  .track-toggle-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: #f3f2ef; border: 1.5px solid #e5e2db;
    color: #555; font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; font-weight: 600;
    padding: 8px 14px; border-radius: 8px; cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .track-toggle-btn:hover { background: #eceae6; color: #1a1a1a; }
  .track-toggle-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
  .chevron-sm { transition: transform 0.2s; }
  .chevron-sm.up { transform: rotate(180deg); }

  /* Timeline */
  .tracking-wrap { padding: 8px 24px 24px; animation: fadeIn 0.3s ease; }

  .tracking-timeline {
    display: flex; align-items: flex-start;
    padding: 16px 0 4px; position: relative;
  }

  .tracking-step { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }

  .track-line {
    position: absolute; top: 17px; right: 50%; width: 100%;
    height: 2px; background: #e5e2db; z-index: 0; transition: background 0.4s;
  }
  .track-line.done { background: #1a1a1a; }

  .track-dot {
    width: 34px; height: 34px; border-radius: 50%;
    background: #f0eeeb; border: 2px solid #e5e2db;
    display: flex; align-items: center; justify-content: center;
    color: #bbb; position: relative; z-index: 1;
    transition: all 0.3s; flex-shrink: 0;
  }
  .track-dot.done { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
  .track-dot.active { background: #fff; border-color: #1a1a1a; color: #1a1a1a; box-shadow: 0 0 0 4px rgba(26,26,26,0.08); }
  .track-num { font-size: 0.7rem; font-weight: 700; color: #ccc; }

  .track-text { margin-top: 10px; text-align: center; padding: 0 2px; }
  .track-label { font-size: 0.73rem; font-weight: 600; color: #ccc; margin: 0 0 3px 0; transition: color 0.3s; }
  .track-label.done { color: #1a1a1a; }
  .track-desc { font-size: 0.67rem; color: #bbb; margin: 0; line-height: 1.3; }

  .tracking-cancelled {
    display: flex; align-items: center; gap: 8px;
    background: #fee2e2; color: #b91c1c;
    font-size: 0.84rem; font-weight: 500;
    padding: 12px 16px; border-radius: 8px; margin: 4px 0 8px;
  }

  /* Items */
  .order-item { display: flex; align-items: center; gap: 14px; padding: 14px 24px; border-bottom: 1px solid #f5f4f1; }
  .order-item:last-of-type { border-bottom: none; }

  .order-item-img { width: 52px; height: 52px; border-radius: 8px; overflow: hidden; background: #f3f2ef; flex-shrink: 0; }
  .order-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }

  .order-item-info { flex: 1; min-width: 0; }
  .order-item-name { font-size: 0.88rem; font-weight: 600; color: #1a1a1a; margin: 0 0 3px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .order-item-qty { font-size: 0.76rem; color: #aaa; margin: 0; }
  .order-item-price { font-size: 0.9rem; font-weight: 600; color: #1a1a1a; margin: 0; white-space: nowrap; }

  .items-total { display: flex; justify-content: space-between; padding: 14px 24px; border-top: 1.5px solid #e5e2db; font-weight: 700; font-size: 0.95rem; color: #1a1a1a; }

  /* Skeleton */
  .skeleton-header { height: 48px; background: linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 10px; margin-bottom: 40px; width: 200px; }
  .skeleton-card { height: 88px; background: linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 14px; margin-bottom: 10px; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* Empty */
  .empty-orders { text-align: center; padding: 80px 20px; background: #fff; border-radius: 14px; }
  .empty-icon { color: #ddd; margin-bottom: 20px; }
  .empty-title { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: #1a1a1a; margin: 0 0 8px 0; }
  .empty-sub { font-size: 0.9rem; color: #aaa; margin: 0; }

  @media (max-width: 600px) {
    .orders-title { font-size: 1.8rem; }
    .order-row, .order-item, .items-total { padding-left: 18px; padding-right: 18px; }
    .items-divider { margin: 0 18px; }
    .track-toggle-wrap, .tracking-wrap { padding-left: 18px; padding-right: 18px; }
    .track-desc { display: none; }
    .track-dot { width: 28px; height: 28px; }
    .track-line { top: 13px; }
  }
`;