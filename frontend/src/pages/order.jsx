import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, Clock, MapPin, Phone, User, ChevronLeft, Download, Share2 } from 'lucide-react';

export default function OrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { cart, cartTotal } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Backend API-യിൽ നിന്ന് ഓർഡർ വിവരങ്ങൾ എടുക്കുന്നതിന് (ഇപ്പോൾ sample data)
  useEffect(() => {
    // API call simulate ചെയ്യുന്നു
    setTimeout(() => {
      setOrder({
        id: orderId || 'ORD' + Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'confirmed',
        items: cart.length > 0 ? cart : [
          { id: 1, name: 'Premium Wireless Headphones', price: 4999, quantity: 1, image: null },
          { id: 2, name: 'Minimalist Leather Watch', price: 2999, quantity: 2, image: null }
        ],
        total: cart.length > 0 ? cartTotal : 10997,
        shipping: {
          name: 'John Doe',
          address: '123, Green Street, Park Avenue',
          city: 'Mumbai',
          phone: '+91 98765 43210'
        },
        paymentMethod: 'Cash on Delivery',
        estimatedDelivery: new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      });
      setLoading(false);
    }, 1000);
  }, [orderId, cart, cartTotal]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-purple-100 text-purple-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'confirmed': return 'Order Confirmed';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return 'Processing';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="w-16 h-16 border-4 border-[#00e676] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-black transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Home</span>
          </button>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Download size={20} className="text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Share2 size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Order Success Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-8 mb-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Package size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-black mb-1">Order Placed Successfully! 🎉</h1>
              <p className="text-white/90">Your order has been confirmed and will be shipped soon.</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Column - Order Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Order Status Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock size={20} className="text-[#00e676]" />
                Order Status
              </h2>
              <div className="flex items-center justify-between">
                {['confirmed', 'processing', 'shipped', 'delivered'].map((step, index) => (
                  <div key={step} className="flex flex-col items-center relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      order.status === step || 
                      (step === 'confirmed' && order.status === 'confirmed') ||
                      (step === 'processing' && order.status === 'confirmed') ||
                      (step === 'processing' && order.status === 'shipped') ||
                      (step === 'shipped' && order.status === 'shipped')
                        ? 'bg-[#00e676] text-black'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="text-xs font-medium mt-2 capitalize">{step}</p>
                    {index < 3 && (
                      <div className={`absolute top-5 left-10 w-full h-0.5 ${
                        (order.status === 'shipped' && index < 2) ||
                        (order.status === 'confirmed' && index < 1)
                          ? 'bg-[#00e676]'
                          : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Package size={24} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{item.price.toLocaleString()}</p>
                      <p className="text-sm text-slate-500">
                        Total: ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Info */}
          <div className="space-y-6">
            
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-mono font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Order Date</span>
                  <span className="font-medium">{order.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Estimated Delivery</span>
                  <span className="font-medium text-emerald-600">{order.estimatedDelivery}</span>
                </div>
                <div className="border-t border-dashed my-3 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-[#00e676]" />
                Shipping Address
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <User size={16} className="text-slate-400 mt-0.5" />
                  <span className="font-medium">{order.shipping.name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-slate-400 mt-0.5" />
                  <span className="text-slate-600">
                    {order.shipping.address}, {order.shipping.city}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone size={16} className="text-slate-400 mt-0.5" />
                  <span className="text-slate-600">{order.shipping.phone}</span>
                </div>
              </div>
            </div>

            {/* Need Help? Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Having issues with your order? Contact our support team.
              </p>
              <button className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-[#00e676] hover:text-black transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}