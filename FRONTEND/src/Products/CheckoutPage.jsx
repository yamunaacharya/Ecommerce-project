import React, { useState } from 'react';
import { useCart } from './cart';
import { useNavigate } from 'react-router-dom';


export default function CheckoutPage() {
  const [form, setForm] = useState({
    country: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [message, setMessage] = useState('');
  const { cartItems, fetchCart } = useCart();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const showOrderSuccess = () => {
    setMessage('Order placed successfully!');
  };

  // Calculate total_amount from cartItems
  const totalAmount = cartItems.reduce((sum, item) => {
    const price = item.product?.price || item.product_detail?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'cod') {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_name: form.firstName + ' ' + form.lastName,
          shipping_address: `${form.address}, ${form.city}, ${form.state}, ${form.zip}, ${form.country}`,
          payment_method: paymentMethod,
          total_amount: totalAmount,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const newOrderId = data.id; // or whatever the backend returns
        await clearCart();
        showOrderSuccess();
        // Example in React
        navigate('/order-confirmation', { state: { orderId: newOrderId } });
      } else {
        // Handle error
      }
    } else if (paymentMethod === 'khalti') {
      navigate('/khalti');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 mb-16 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
      <form onSubmit={handleSubmit}>
        {/* Country/Region as text input */}
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country/Region"
          required
          className="mb-4 w-full p-2 border rounded"
        />
        {/* First and Last Name */}
        <div className="flex gap-4 mb-4">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
            required
            className="w-1/2 p-2 border rounded"
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
            required
            className="w-1/2 p-2 border rounded"
          />
        </div>
        {/* Address */}
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          required
          className="mb-4 w-full p-2 border rounded"
        />
        {/* City, State, ZIP */}
        <div className="flex gap-4 mb-4">
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            required
            className="w-1/3 p-2 border rounded"
          />
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            required
            className="w-1/3 p-2 border rounded"
          />
          <input
            name="zip"
            value={form.zip}
            onChange={handleChange}
            placeholder="ZIP code"
            required
            className="w-1/3 p-2 border rounded"
          />
        </div>
        {/* Phone */}
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
          className="mb-6 w-full p-2 border rounded"
        />
        {/* Payment Section */}
        <h2 className="text-xl font-bold mb-4 mt-8">Payment</h2>
        <div className="mb-6">
          <label className="flex items-center mb-2">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              className="mr-2"
            />
            Cash on Delivery
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="payment"
              value="khalti"
              checked={paymentMethod === 'khalti'}
              onChange={() => setPaymentMethod('khalti')}
              className="mr-2"
            />
            Khalti
          </label>
        </div>
        {/* Show total amount */}
        <div className="mb-4 text-right font-semibold">Total: Rs. {totalAmount}</div>
        {message && <div className="mb-4 text-green-600 font-semibold text-center">{message}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
