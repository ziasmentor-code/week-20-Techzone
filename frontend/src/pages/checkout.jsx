import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

// 1. Styles മുകളിൽ തന്നെ നൽകുന്നു (ReferenceError ഒഴിവാക്കാൻ)
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');
  .checkout-page { min-height: 100vh; background: #f8f7f4; padding: 48px 20px 80px; font-family: 'DM Sans', sans-serif; }
  .checkout-container { max-width: 1100px; margin: 0 auto; }
  .checkout-header { margin-bottom: 40px; border-bottom: 1.5px solid #e5e2db; padding-bottom: 24px; }
  .checkout-title { font-family: 'DM Serif Display', serif; font-size: 2.4rem; color: #1a1a1a; margin: 0; }
  .checkout-layout { display: grid; grid-template-columns: 1fr 360px; gap: 32px; }
  .checkout-form-card, .summary-card { background: #fff; border-radius: 14px; padding: 32px; }
  .field-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 15px; }
  .field-input { width: 100%; padding: 13px; border: 1.5px solid #e5e2db; border-radius: 10px; box-sizing: border-box; }
  .place-order-btn { width: 100%; background: #1a1a1a; color: #fff; padding: 16px; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; }
  .place-order-btn:disabled { opacity: 0.7; }
  .summary-item { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
  .summary-item-img { width: 50px; height: 50px; background: #eee; border-radius: 8px; overflow: hidden; }
  .summary-item-img img { width: 100%; height: 100%; object-fit: cover; }
`;

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ street: '', city: '', pincode: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        shippingAddress: `${formData.street}, ${formData.city} - ${formData.pincode}`,
        phone: formData.phone
      };

      // baseURL-ൽ /api/ ഉള്ളതുകൊണ്ട് 'orders/place/' എന്ന് മാത്രം മതി
      const response = await API.post('orders/place/', orderData);

      if (response.status === 201 || response.status === 200) {
        clearCart();
        navigate('/order-success');
      }
    } catch (err) {
      // ബാക്കെൻഡിൽ നിന്നുള്ള എറർ മെസ്സേജ് കാണിക്കുന്നു (ഉദാഹരണത്തിന്: Cart not found)
      const errorMsg = err.response?.data?.error || "Checkout failed.";
      console.error("Order error details:", err.response?.data);
      alert(errorMsg);
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
          <div className="checkout-header">
            <h1 className="checkout-title">Checkout</h1>
          </div>

          <div className="checkout-layout">
            <div className="checkout-form-card">
              <form onSubmit={handleSubmit}>
                <div className="field-group">
                  <label>Street / House Name</label>
                  <input className="field-input" type="text" required onChange={update('street')} />
                </div>
                <div className="field-group">
                  <label>City</label>
                  <input className="field-input" type="text" required onChange={update('city')} />
                </div>
                <div className="field-group">
                  <label>Pincode</label>
                  <input className="field-input" type="text" required onChange={update('pincode')} />
                </div>
                <div className="field-group">
                  <label>Phone Number</label>
                  <input className="field-input" type="tel" required onChange={update('phone')} />
                </div>
                <button type="submit" className="place-order-btn" disabled={loading}>
                  {loading ? "Processing..." : `Place Order · ₹${totalAmount.toLocaleString()}`}
                </button>
              </form>
            </div>

            <div className="summary-card">
              <h3>Order Summary</h3>
              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-img">
                    <img src={item.image?.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`} alt={item.name} />
                  </div>
                  <div style={{ flex: 1 }}>{item.name} (x{item.quantity})</div>
                  <div>₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}