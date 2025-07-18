import React, { useEffect, useState } from 'react';

const statusOptions = [
  'pending',
  'shipped',
  'delivered',
  'cancelled',
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://localhost:8000/api/orders/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch orders.');
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

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders =>
      orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleUpdateStatus = async (orderId, status) => {
    setUpdating(u => ({ ...u, [orderId]: true }));
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:8000/api/orders/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status.');
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setUpdating(u => ({ ...u, [orderId]: false }));
    }
  };

  if (loading) return <div className="text-center mt-16">Loading orders...</div>;
  if (error) return <div className="text-center text-red-600 mt-16">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-28 mb-16 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-8 text-center">All Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Shipping Address</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Payment</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50">
                  <td className="p-2 border">{order.id}</td>
                  <td className="p-2 border">{order.customer_name}</td>
                  <td className="p-2 border">{order.shipping_address}</td>
                  <td className="p-2 border">{new Date(order.order_date).toLocaleString()}</td>
                  <td className="p-2 border">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <button
                      className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                      disabled={updating[order.id]}
                      onClick={() => handleUpdateStatus(order.id, order.status)}
                    >
                      {updating[order.id] ? 'Updating...' : 'Update'}
                    </button>
                  </td>
                  <td className="p-2 border">{order.payment_method}</td>
                  <td className="p-2 border">Rs. {order.total_amount}</td>
                  <td className="p-2 border">
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    >
                      {expandedOrderId === order.id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan={8} className="p-2 border bg-gray-50">
                      <div className="overflow-x-auto">
                        <table className="min-w-full border text-left">
                          <thead className="bg-gray-200">
                            <tr>
                              <th className="p-2 border">Image</th>
                              <th className="p-2 border">Product Name</th>
                              <th className="p-2 border">Quantity</th>
                              <th className="p-2 border">Price</th>
                              <th className="p-2 border">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items && order.items.length > 0 ? order.items.map(item => (
                              <tr key={item.id}>
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
                            )) : (
                              <tr><td colSpan={5} className="text-gray-500">No products found for this order.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 