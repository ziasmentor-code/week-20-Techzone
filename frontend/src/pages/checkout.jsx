import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ street: '', city: '', pincode: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        orderItems: cart,
        totalPrice: totalAmount,
        shippingAddress: `${formData.street}, ${formData.city} - ${formData.pincode}`,
        phone: formData.phone
      };
      const response = await API.post('/orders/place/', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 201) {
        clearCart();
        navigate('/order-success');
      }
    } catch (err) {
      alert("Checkout failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  return (
    <>
      <style>{styles}</style>
      <div className="checkout-page">
        <div className="checkout-container">

          {/* Header */}
          <div className="checkout-header">
            <h1 className="checkout-title">Checkout</h1>
            <p className="checkout-sub">Almost there — just a few details</p>
          </div>

          <div className="checkout-layout">

            {/* Form */}
            <div className="checkout-form-card">
              <div className="section-label">
                <span className="section-num">01</span>
                <h2 className="section-title">Delivery Details</h2>
              </div>

              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="field-group">
                  <label className="field-label">Street / House Name</label>
                  <input
                    type="text"
                    className={`field-input ${focused === 'street' ? 'focused' : ''}`}
                    placeholder="e.g. 12B, Rose Garden Apartments"
                    required
                    onFocus={() => setFocused('street')}
                    onBlur={() => setFocused('')}
                    onChange={update('street')}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">City</label>
                  <input
                    type="text"
                    className={`field-input ${focused === 'city' ? 'focused' : ''}`}
                    placeholder="e.g. Kochi"
                    required
                    onFocus={() => setFocused('city')}
                    onBlur={() => setFocused('')}
                    onChange={update('city')}
                  />
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label">Pincode</label>
                    <input
                      type="text"
                      className={`field-input ${focused === 'pincode' ? 'focused' : ''}`}
                      placeholder="682001"
                      required
                      maxLength={6}
                      onFocus={() => setFocused('pincode')}
                      onBlur={() => setFocused('')}
                      onChange={update('pincode')}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Phone Number</label>
                    <input
                      type="tel"
                      className={`field-input ${focused === 'phone' ? 'focused' : ''}`}
                      placeholder="+91 98765 43210"
                      required
                      onFocus={() => setFocused('phone')}
                      onBlur={() => setFocused('')}
                      onChange={update('phone')}
                    />
                  </div>
                </div>

                <div className="payment-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Cash on Delivery
                </div>

                <button type="submit" className={`place-order-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                  {loading ? (
                    <span className="spinner" />
                  ) : (
                    <>
                      Place Order · ₹{totalAmount.toLocaleString()}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>

                <p className="secure-note">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  Secure & encrypted checkout
                </p>
              </form>
            </div>

            {/* Summary */}
            <div className="summary-card">
              <div className="section-label">
                <span className="section-num">02</span>
                <h2 className="section-title">Order Summary</h2>
              </div>

              <div className="summary-items">
                {cart.map((item, i) => (
                  <div key={item.id} className="summary-item" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="summary-item-img">
                      <img
                        src={item.image?.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`}
                        alt={item.name}
                      />
                      <span className="qty-badge">{item.quantity}</span>
                    </div>
                    <div className="summary-item-info">
                      <p className="summary-item-name">{item.name}</p>
                      <p className="summary-item-unit">₹{Number(item.price).toLocaleString()} each</p>
                    </div>
                    <p className="summary-item-total">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="total-row-sm">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="total-row-sm">
                  <span>Delivery</span>
                  <span className="free-tag">Free</span>
                </div>
                <div className="total-divider" />
                <div className="total-row-lg">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

  .checkout-page {
    min-height: 100vh;
    background: #f8f7f4;
    padding: 48px 20px 80px;
    font-family: 'DM Sans', sans-serif;
  }

  .checkout-container {
    max-width: 1100px;
    margin: 0 auto;
  }

  .checkout-header {
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 1.5px solid #e5e2db;
  }

  .checkout-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.4rem;
    color: #1a1a1a;
    margin: 0 0 4px 0;
    line-height: 1;
  }

  .checkout-sub {
    font-size: 0.9rem;
    color: #888;
    margin: 0;
  }

  .checkout-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 32px;
    align-items: start;
  }

  @media (max-width: 820px) {
    .checkout-layout { grid-template-columns: 1fr; }
    .checkout-title { font-size: 1.8rem; }
  }

  /* Section Label */
  .section-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .section-num {
    font-size: 0.7rem;
    font-weight: 600;
    color: #aaa;
    letter-spacing: 0.08em;
    background: #f3f2ef;
    padding: 4px 8px;
    border-radius: 5px;
  }

  .section-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.3rem;
    color: #1a1a1a;
    margin: 0;
  }

  /* Form Card */
  .checkout-form-card {
    background: #fff;
    border-radius: 14px;
    padding: 32px;
  }

  .checkout-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
  }

  .field-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #888;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .field-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #e5e2db;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: #1a1a1a;
    background: #fafaf8;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .field-input::placeholder { color: #ccc; }

  .field-input.focused,
  .field-input:focus {
    border-color: #1a1a1a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(26,26,26,0.06);
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 480px) {
    .field-row { grid-template-columns: 1fr; }
  }

  .payment-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #f3f2ef;
    color: #555;
    font-size: 0.82rem;
    font-weight: 500;
    padding: 10px 16px;
    border-radius: 8px;
    border: 1.5px dashed #ddd;
    width: fit-content;
  }

  .place-order-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    background: #1a1a1a;
    color: #fff;
    border: none;
    padding: 16px 24px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    letter-spacing: 0.01em;
    margin-top: 6px;
  }

  .place-order-btn:hover:not(:disabled) { background: #333; }
  .place-order-btn:active:not(:disabled) { transform: scale(0.98); }
  .place-order-btn.loading { opacity: 0.7; cursor: not-allowed; }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .secure-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 0.75rem;
    color: #bbb;
    margin: 0;
  }

  /* Summary Card */
  .summary-card {
    background: #fff;
    border-radius: 14px;
    padding: 28px;
    position: sticky;
    top: 24px;
  }

  .summary-items {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 24px;
  }

  .summary-item {
    display: flex;
    align-items: center;
    gap: 12px;
    animation: fadeUp 0.35s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .summary-item-img {
    position: relative;
    width: 52px;
    height: 52px;
    border-radius: 8px;
    overflow: hidden;
    background: #f3f2ef;
    flex-shrink: 0;
  }

  .summary-item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .qty-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #1a1a1a;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .summary-item-info {
    flex: 1;
    min-width: 0;
  }

  .summary-item-name {
    font-size: 0.87rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 2px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .summary-item-unit {
    font-size: 0.75rem;
    color: #aaa;
    margin: 0;
  }

  .summary-item-total {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    white-space: nowrap;
  }

  .summary-totals {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-top: 1.5px solid #e5e2db;
    padding-top: 18px;
  }

  .total-row-sm {
    display: flex;
    justify-content: space-between;
    font-size: 0.88rem;
    color: #888;
  }

  .free-tag {
    color: #2e7d32;
    font-weight: 600;
    font-size: 0.82rem;
  }

  .total-divider {
    border: none;
    border-top: 1px solid #f0eeeb;
  }

  .total-row-lg {
    display: flex;
    justify-content: space-between;
    font-size: 1.05rem;
    font-weight: 700;
    color: #1a1a1a;
  }
`;