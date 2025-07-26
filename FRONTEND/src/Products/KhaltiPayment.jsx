import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './cart';

export default function KhaltiPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { cartItems, fetchCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const orderDetails = location.state?.orderDetails || {
    customer_name: '',
    shipping_address: '',
    total_amount: cartItems.reduce((sum, item) => {
      const price = item.product?.price || item.product_detail?.price || 0;
      return sum + price * item.quantity;
    }, 0),
  };

  const clearCart = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      await fetch('http://localhost:8000/api/cart-items/clear/', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      localStorage.removeItem('guest_cart');
    }
    fetchCart();
  };


  const createOrder = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch('http://localhost:8000/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer_name: orderDetails.customer_name,
        shipping_address: orderDetails.shipping_address,
        payment_method: 'khalti',
        total_amount: orderDetails.total_amount,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create order');
    }

    const orderData = await response.json();
    return orderData.id; 
  };

  
  const handleKhaltiPayment = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
    
      if (!orderDetails.customer_name || !orderDetails.shipping_address || !orderDetails.total_amount) {
        throw new Error('Missing order details. Please go back to checkout.');
      }

      const orderId = await createOrder();
      console.log('✅ Order created with ID:', orderId);

      const response = await fetch('http://localhost:8000/api/initiate-khalti-payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: orderDetails.total_amount * 100,
          purchase_order_id: `order_${orderId}`,
          return_url: `http://localhost:5173/order-confirmation?order_id=${orderId}`,
          website_url: "http://localhost:5173",
          name: orderDetails.customer_name || "Customer",
          email: "customer@example.com",
          phone: "9800000000",
        }),
      });

      const rawText = await response.text();
      console.log("🔹 RAW RESPONSE TEXT:", rawText);

      if (!response.ok) {
        throw new Error(`Server Error (Status: ${response.status}): ${rawText}`);
      }

      const data = JSON.parse(rawText);

      if (data.payment_url) {
        setSuccess('Redirecting to Khalti for payment...');
        await clearCart();
        window.location.href = data.payment_url;
      } else {
        throw new Error("No payment URL received from Khalti");
      }
    } catch (err) {
      console.error("❌ Payment initiation error:", err);
      setError("Payment initiation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-2xl mx-auto mt-28 mb-16 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Khalti Payment</h2>

      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <p><strong>Customer:</strong> {orderDetails.customer_name}</p>
        <p><strong>Address:</strong> {orderDetails.shipping_address}</p>
        <p><strong>Total Amount:</strong> Rs. {orderDetails.total_amount}</p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Payment Instructions</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Click "Pay with Khalti" to proceed with payment</li>
          <li>• You will be redirected to Khalti's secure payment gateway</li>
          <li>• Complete the payment using your Khalti account</li>
          <li>• After successful payment, you will return to this site</li>
        </ul>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleBackToCheckout}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
        >
          Back to Checkout
        </button>

        <button
          onClick={handleKhaltiPayment}
          disabled={loading}
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay with Khalti'}
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Powered by Khalti</p>
        <p className="mt-2">Secure payment gateway</p>
      </div>
    </div>
  );
}
