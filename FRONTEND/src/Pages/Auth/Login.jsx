import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../Components/Input';

export default function Login() {
  useEffect(() => {
    localStorage.removeItem('guest_cart');
  }, []);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'customer', 
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: formData.role, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        if (guestCart.length > 0) {
          const token = data.access;
          const addAllToCart = async () => {
            for (const item of guestCart) {
              try {
                await fetch('http://localhost:8000/api/cart-items/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    product: item.product.id,
                    quantity: item.quantity,
                  }),
                });
              } catch (e) {
                
              }
            }
            localStorage.removeItem('guest_cart');
          };
          await addAllToCart();
        }

        setMessage('Login successful! Redirecting...');

        if (data.user.role === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/');
        }
      } else {
        setMessage(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-24 mb-24">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {message && (
        <p className={`mb-4 text-center ${message.toLowerCase().includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <Input
          labelText="Username"
          labelFor="username"
          id="username"
          name="username"
          type="text"
          isRequired={true}
          placeholder="Enter username"
          value={formData.username}
          handleChange={handleChange}
        />
        <Input
          labelText="Password"
          labelFor="password"
          id="password"
          name="password"
          type="password"
          isRequired={true}
          placeholder="Enter password"
          value={formData.password}
          handleChange={handleChange}
        />

        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 mb-1 font-medium">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
