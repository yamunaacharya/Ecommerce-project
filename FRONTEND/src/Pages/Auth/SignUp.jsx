import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../Components/Input';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    role: 'customer',
    password: '',
    password2: '', 
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = ['customer'];

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

    console.log('Submitting form data:', formData);

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response from backend:', data);

      if (response.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setFormData({
          username: '',
          email: '',
          phone: '',
          role: 'customer',
          password: '',
          password2: '', 
        });

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        const errorMessages = Object.entries(data)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join(' | ');
        setMessage('Registration failed: ' + errorMessages);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-24 mb-24">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
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
          labelText="Email"
          labelFor="email"
          id="email"
          name="email"
          type="email"
          isRequired={true}
          placeholder="Enter email"
          value={formData.email}
          handleChange={handleChange}
        />
        <Input
          labelText="Phone"
          labelFor="phone"
          id="phone"
          name="phone"
          type="text"
          isRequired={false}
          placeholder="Enter phone number"
          value={formData.phone}
          handleChange={handleChange}
        />
        <Input
          labelText="Role"
          labelFor="role"
          id="role"
          name="role"
          type="select"
          isRequired={true}
          value={formData.role}
          handleChange={handleChange}
          options={roles}
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
        <Input
          labelText="Confirm Password"
          labelFor="password2"
          id="password2"
          name="password2"
          type="password"
          isRequired={true}
          placeholder="Confirm password"
          value={formData.password2}
          handleChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
