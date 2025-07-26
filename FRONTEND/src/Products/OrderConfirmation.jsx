import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const pidx = searchParams.get('pidx');
        const orderId = searchParams.get('order_id');
        
        if (pidx && orderId) {
          const verifyResponse = await fetch(`http://localhost:8000/api/verify-khalti/?pidx=${pidx}`);
          const verifyData = await verifyResponse.json();
          
          console.log('Khalti verification response:', verifyData);
          
          if (verifyData.status === 'Completed') {
            const token = localStorage.getItem('access_token');
            const updateResponse = await fetch(`http://localhost:8000/api/orders/${orderId}/`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                khalti_transaction_id: pidx,
                khalti_token: verifyData.token || '',
                status: 'pending',
              }),
            });
            
            if (updateResponse.ok) {
              const updatedOrder = await updateResponse.json();
              setOrderDetails(updatedOrder);
            }
          } else {
            setError('Payment verification failed. Please contact support.');
          }
        } else if (location.state?.orderId) {
          const token = localStorage.getItem('access_token');
          const response = await fetch(`http://localhost:8000/api/orders/${location.state.orderId}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const order = await response.json();
            setOrderDetails(order);
          }
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Error verifying payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, location.state]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-20 mb-20 p-8 bg-white rounded shadow text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Verifying your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-20 mb-20 p-8 bg-white rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Payment Error</h1>
        <p className="text-lg mb-6 text-red-500">{error}</p>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 mb-20 p-8 bg-white rounded shadow text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Thank You for Your Order!</h1>
      <p className="text-lg mb-6">Your order has been placed successfully.</p>
      
      {orderDetails && (
        <div className="mb-6 p-4 bg-gray-50 rounded text-left">
          <h3 className="font-semibold mb-2">Order Details:</h3>
          <p><strong>Order ID:</strong> {orderDetails.id}</p>
          <p><strong>Customer:</strong> {orderDetails.customer_name}</p>
          <p><strong>Total Amount:</strong> Rs. {orderDetails.total_amount}</p>
          <p><strong>Payment Method:</strong> {orderDetails.payment_method === 'khalti' ? 'Khalti' : 'Cash on Delivery'}</p>
          {orderDetails.khalti_transaction_id && (
            <p><strong>Transaction ID:</strong> {orderDetails.khalti_transaction_id}</p>
          )}
          <p><strong>Status:</strong> {orderDetails.status}</p>
        </div>
      )}
      
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => navigate('/')}
      >
        Return to Home
      </button>
    </div>
  );
} 