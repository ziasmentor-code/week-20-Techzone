import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, CheckCircle } from 'lucide-react';

export default function Checkout() {
  // context-ൽ നിന്ന് ഡാറ്റ എടുക്കുമ്പോൾ default വാല്യൂസ് നൽകുന്നു
  const { cart = [], cartTotal = 0, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    name: '', address: '', city: '', phone: ''
  });

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    console.log("Order Data:", { items: cart, total: cartTotal, customer: formData });
    
    setOrderPlaced(true);
    setTimeout(() => {
      if (clearCart) clearCart();
      navigate('/');
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <CheckCircle size={80} className="text-[#00e676] mb-4 animate-bounce" />
        <h2 className="text-3xl font-black">ORDER PLACED!</h2>
        <p className="text-slate-500 mt-2">Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Shipping Form */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
            <Truck size={24} /> SHIPPING DETAILS
          </h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <input type="text" placeholder="Full Name" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-[#00e676]" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <textarea placeholder="Complete Address" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-[#00e676]"
              onChange={(e) => setFormData({...formData, address: e.target.value})} />
            <input type="text" placeholder="City" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-[#00e676]"
              onChange={(e) => setFormData({...formData, city: e.target.value})} />
            <input type="tel" placeholder="Phone Number" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-[#00e676]"
              onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            
            <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-black hover:bg-[#00e676] hover:text-black transition-all mt-4">
              CONFIRM ORDER - ₹{(cartTotal || 0).toLocaleString()}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit sticky top-24">
          <h2 className="text-2xl font-black mb-6">ORDER SUMMARY</h2>
          <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2">
            {/* cart ഉണ്ടെങ്കിൽ മാത്രം map ചെയ്യുക */}
            {cart && cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={item.id || index} className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-500">{item.name} (x{item.quantity || 1})</span>
                  <span>₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400">No items in cart</p>
            )}
          </div>
          <div className="border-t border-dashed pt-4 space-y-2">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>₹{(cartTotal || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery</span>
              <span className="text-emerald-500 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-xl font-black pt-2 border-t mt-4">
              <span>Total</span>
              <span>₹{(cartTotal || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}