import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <div className="max-w-xl mx-auto mt-20 mb-20 p-8 bg-white rounded shadow text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Thank You for Your Order!</h1>
      <p className="text-lg mb-6">Your order has been placed successfully.</p>
      {orderId && (
        <div className="mb-4">
          <span className="font-semibold">Order ID:</span> <span>{orderId}</span>
        </div>
      )}
      <p className="mb-8">A confirmation email has been sent to your registered email address.</p>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => navigate('/')}
      >
        Return to Home
      </button>
    </div>
  );
} 