import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [removingId, setRemovingId] = useState(null);

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 300);
  };

  const proceedToCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to proceed to checkout");
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="cart-empty-wrapper">
          <div className="cart-empty-box">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h2 className="empty-title">Your bag is empty</h2>
            <p className="empty-sub">Looks like you haven't added anything yet.</p>
            <button onClick={() => navigate('/products')} className="btn-primary full-width">
              Explore Products
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="cart-page">
        <div className="cart-container">

          {/* Header */}
          <div className="cart-header">
            <div>
              <h1 className="cart-title">Shopping Bag</h1>
              <p className="cart-subtitle">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            </div>
            <button onClick={clearCart} className="btn-ghost">
              Clear all
            </button>
          </div>

          <div className="cart-layout">
            {/* Items List */}
            <div className="cart-items">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className={`cart-item ${removingId === item.id ? 'removing' : ''}`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="item-image-wrap">
                    <img
                      src={item.image?.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`}
                      alt={item.name}
                      className="item-image"
                    />
                  </div>

                  <div className="item-info">
                    <div className="item-top">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-price">₹{Number(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <p className="item-unit-price">₹{Number(item.price).toLocaleString()} each</p>

                    <div className="item-actions">
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >+</button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span className="free-tag">Free</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={proceedToCheckout} className="btn-primary checkout-btn">
                Proceed to Checkout
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              <p className="secure-note">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Secure & encrypted checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

  .cart-page {
    min-height: 100vh;
    background: #f8f7f4;
    padding: 48px 20px 80px;
    font-family: 'DM Sans', sans-serif;
  }

  .cart-container {
    max-width: 1100px;
    margin: 0 auto;
  }

  .cart-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 1.5px solid #e5e2db;
  }

  .cart-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.4rem;
    color: #1a1a1a;
    margin: 0 0 4px 0;
    line-height: 1;
  }

  .cart-subtitle {
    font-size: 0.9rem;
    color: #888;
    margin: 0;
    font-weight: 400;
    letter-spacing: 0.02em;
  }

  .cart-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 32px;
    align-items: start;
  }

  @media (max-width: 800px) {
    .cart-layout {
      grid-template-columns: 1fr;
    }
    .cart-title { font-size: 1.8rem; }
  }

  /* Cart Items */
  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .cart-item {
    display: flex;
    gap: 20px;
    background: #fff;
    padding: 22px;
    border-radius: 14px;
    animation: slideIn 0.35s ease both;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .cart-item.removing {
    opacity: 0;
    transform: translateX(20px);
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .item-image-wrap {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    overflow: hidden;
    background: #f3f2ef;
    flex-shrink: 0;
  }

  .item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .item-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  .item-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    line-height: 1.3;
    max-width: 280px;
  }

  .item-price {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    white-space: nowrap;
  }

  .item-unit-price {
    font-size: 0.8rem;
    color: #aaa;
    margin: 4px 0 0 0;
  }

  .item-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
  }

  .qty-control {
    display: flex;
    align-items: center;
    border: 1.5px solid #e5e2db;
    border-radius: 8px;
    overflow: hidden;
    background: #fafaf8;
  }

  .qty-btn {
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    color: #555;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qty-btn:hover { background: #f0eeeb; }

  .qty-value {
    min-width: 32px;
    text-align: center;
    font-weight: 600;
    font-size: 0.9rem;
    color: #1a1a1a;
  }

  .remove-btn {
    background: none;
    border: none;
    font-size: 0.82rem;
    font-weight: 500;
    color: #c0392b;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    padding: 4px 0;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.15s;
  }

  .remove-btn:hover { color: #922b21; }

  /* Order Summary */
  .order-summary {
    background: #fff;
    border-radius: 14px;
    padding: 28px;
    position: sticky;
    top: 24px;
  }

  .summary-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.3rem;
    color: #1a1a1a;
    margin: 0 0 24px 0;
  }

  .summary-rows {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.92rem;
    color: #555;
    font-weight: 400;
  }

  .free-tag {
    color: #2e7d32;
    font-weight: 600;
    font-size: 0.85rem;
  }

  .summary-divider {
    border: none;
    border-top: 1.5px solid #e5e2db;
    margin: 4px 0;
  }

  .total-row {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .checkout-btn {
    margin-top: 24px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .secure-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 0.76rem;
    color: #bbb;
    margin: 14px 0 0 0;
    font-weight: 400;
  }

  /* Buttons */
  .btn-primary {
    background: #1a1a1a;
    color: #fff;
    border: none;
    padding: 14px 24px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    letter-spacing: 0.01em;
    transition: background 0.2s, transform 0.1s;
  }

  .btn-primary:hover { background: #333; }
  .btn-primary:active { transform: scale(0.98); }

  .full-width { width: 100%; }

  .btn-ghost {
    background: none;
    border: 1.5px solid #ddd;
    color: #888;
    padding: 8px 16px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }

  .btn-ghost:hover { border-color: #bbb; color: #555; }

  /* Empty State */
  .cart-empty-wrapper {
    min-height: 100vh;
    background: #f8f7f4;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: 'DM Sans', sans-serif;
  }

  .cart-empty-box {
    background: #fff;
    border-radius: 20px;
    padding: 60px 48px;
    text-align: center;
    max-width: 380px;
    width: 100%;
  }

  .empty-icon {
    color: #ccc;
    margin-bottom: 20px;
  }

  .empty-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.6rem;
    color: #1a1a1a;
    margin: 0 0 8px 0;
  }

  .empty-sub {
    color: #aaa;
    font-size: 0.9rem;
    margin: 0 0 32px 0;
  }
`;