import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-50 p-10 rounded-3xl shadow-sm text-center max-w-md border border-gray-100">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-10 h-10 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="3" 
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">Success!</h1>
        <p className="text-gray-600 mb-8">
          Your order has been placed successfully. We have received your request and are starting the delivery process.
        </p>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all transform active:scale-95"
          >
            Continue Shopping
          </button>
          
          <button 
            onClick={() => navigate('/my-orders')}
            className="w-full bg-white text-gray-800 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-all transform active:scale-95"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}