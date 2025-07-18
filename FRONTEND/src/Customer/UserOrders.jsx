import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('You must be logged in to view your orders.');
          setLoading(false);
          return;
        }
        const res = await fetch('http://localhost:8000/api/orders/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch orders.');
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center mt-16">Loading your orders...</div>;
  if (error) return <div className="text-center text-red-600 mt-16">{error}</div>;
  if (orders.length === 0) return <div className="text-center mt-16">You have not placed any orders yet.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-16 mb-16 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-8 text-center">My Orders</h2>
      {orders.map(order => (
        <div key={order.id} className="mb-10 border-b pb-6">
          <div className="mb-2 flex flex-wrap justify-between items-center">
            <div>
              <span className="font-semibold">Order ID:</span> {order.id}
            </div>
            <div>
              <span className="font-semibold">Date:</span> {new Date(order.order_date).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {order.status}
            </div>
            <div>
              <span className="font-semibold">Total:</span> Rs. {order.total_amount}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Products:</h3>
            {order.items && order.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Image</th>
                      <th className="p-2 border">Product Name</th>
                      <th className="p-2 border">Quantity</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-2 border">
                          {item.product && item.product.image_url ? (
                            <img src={item.product.image_url} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="p-2 border">{item.product?.name}</td>
                        <td className="p-2 border">{item.quantity}</td>
                        <td className="p-2 border">Rs. {item.price}</td>
                        <td className="p-2 border">Rs. {item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500">No products found for this order.</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 