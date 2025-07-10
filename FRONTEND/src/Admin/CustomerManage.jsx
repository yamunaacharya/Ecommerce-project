import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await axios.get('http://localhost:8000/api/users/', {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      setCustomers(res.data);
    } catch (err) {
      alert('Failed to fetch customers');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const customerUsers = customers.filter(c => c.role === 'customer');

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setEditData({ ...customer });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(`http://localhost:8000/api/users/${editingId}/`, editData, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      alert('Failed to update customer');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}/`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      fetchCustomers();
    } catch (err) {
      alert('Failed to delete customer');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-24 mb-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Registered Customers</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerUsers.map((customer) =>
              editingId === customer.id ? (
                <tr key={customer.id}>
                  <td className="p-2 border">{customer.id}</td>
                  <td className="p-2 border">
                    <input
                      name="username"
                      value={editData.username}
                      onChange={handleEditChange}
                      className="border p-1"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      className="border p-1"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      name="role"
                      value={editData.role}
                      onChange={handleEditChange}
                      className="border p-1"
                    />
                  </td>
                  <td className="p-2 border">
                    <button onClick={handleEditSave} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Save</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={customer.id}>
                  <td className="p-2 border">{customer.id}</td>
                  <td className="p-2 border">{customer.username}</td>
                  <td className="p-2 border">{customer.email}</td>
                  <td className="p-2 border">{customer.role}</td>
                  <td className="p-2 border">
                    <button onClick={() => handleEdit(customer)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(customer.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Customers;
