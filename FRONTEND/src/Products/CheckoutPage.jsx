import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Order placed successfully!');
    navigate('/payment');
  };

  return (
    <div className="max-w-lg mx-auto mt-24 mb-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="mb-3 w-full p-2 border rounded" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required className="mb-3 w-full p-2 border rounded" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="mb-3 w-full p-2 border rounded" />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" required className="mb-3 w-full p-2 border rounded" />
        <input name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP Code" required className="mb-3 w-full p-2 border rounded" />
        <input name="country" value={form.country} onChange={handleChange} placeholder="Country" required className="mb-3 w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Place Order</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
