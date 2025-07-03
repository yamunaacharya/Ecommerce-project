// File: src/Pages/AdminDashboard.jsx or ProductManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: ''
  });

  // Load all products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:8000/api/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingProduct) {
      // Update existing product
      axios.put(`http://localhost:8000/api/products/${editingProduct.id}/`, form)
        .then(res => {
          setProducts(products.map(p => p.id === res.data.id ? res.data : p));
          setShowModal(false);
        })
        .catch(err => console.error("Error updating product:", err));
    } else {
      // Create new product
      axios.post('http://localhost:8000/api/products/', form)
        .then(res => {
          setProducts([...products, res.data]);
          setShowModal(false);
        })
        .catch(err => console.error("Error creating product:", err));
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      category: product.category?.id || ''
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category: ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios.delete(`http://localhost:8000/api/products/${id}/`)
        .then(() => {
          setProducts(products.filter(p => p.id !== id));
        })
        .catch(err => console.error("Error deleting product:", err));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 flex items-center justify-between">
          {!sidebarCollapsed && <h1 className="text-xl font-bold">EcomAdmin</h1>}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-full hover:bg-gray-800 cursor-pointer"
          >
            <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-sm`}></i>
          </button>
        </div>
        <nav className="mt-6">
          <div
            className={`flex items-center p-4 cursor-pointer ${activeMenu === 'dashboard' ? 'bg-indigo-800' : 'hover:bg-gray-800'}`}
            onClick={() => setActiveMenu('dashboard')}
          >
            <i className="fas fa-tachometer-alt text-lg"></i>
            {!sidebarCollapsed && <span className="ml-4">Dashboard</span>}
          </div>
          <div
            className={`flex items-center p-4 cursor-pointer ${activeMenu === 'products' ? 'bg-indigo-800' : 'hover:bg-gray-800'}`}
            onClick={() => setActiveMenu('products')}
          >
            <i className="fas fa-box text-lg"></i>
            {!sidebarCollapsed && <span className="ml-4">Products</span>}
          </div>
          <div
            className={`flex items-center p-4 cursor-pointer ${activeMenu === 'orders' ? 'bg-indigo-800' : 'hover:bg-gray-800'}`}
            onClick={() => setActiveMenu('orders')}
          >
            <i className="fas fa-shopping-cart text-lg"></i>
            {!sidebarCollapsed && <span className="ml-4">Orders</span>}
          </div>
          <div
            className={`flex items-center p-4 cursor-pointer ${activeMenu === 'customers' ? 'bg-indigo-800' : 'hover:bg-gray-800'}`}
            onClick={() => setActiveMenu('customers')}
          >
            <i className="fas fa-users text-lg"></i>
            {!sidebarCollapsed && <span className="ml-4">Customers</span>}
          </div>
          <div
            className={`flex items-center p-4 cursor-pointer ${activeMenu === 'analytics' ? 'bg-indigo-800' : 'hover:bg-gray-800'}`}
            onClick={() => setActiveMenu('analytics')}
          >
            <i className="fas fa-chart-line text-lg"></i>
            {!sidebarCollapsed && <span className="ml-4">Analytics</span>}
          </div>
          <div
            className={`flex items-center p-4 cursor-pointer ${activeMenu === 'settings' ? 'bg-indigo-800' : 'hover:bg-gray-800'}`}
            onClick={() => setActiveMenu('settings')}
          >
            <i className="fas fa-cog text-lg"></i>
            {!sidebarCollapsed && <span className="ml-4">Settings</span>}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center w-1/3">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative cursor-pointer">
                <i className="fas fa-bell text-gray-600 text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </div>
              <div className="flex items-center cursor-pointer">
                <i className="fas fa-user-circle text-gray-600 text-2xl"></i>
                <span className="ml-2 text-gray-700">Admin User</span>
                <i className="fas fa-chevron-down ml-2 text-gray-500 text-sm"></i>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Sales</p>
                  <h3 className="text-2xl font-bold text-gray-800">$24,780</h3>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <i className="fas fa-dollar-sign text-indigo-600 text-xl"></i>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <h3 className="text-2xl font-bold text-gray-800">1,482</h3>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <i className="fas fa-shopping-bag text-orange-600 text-xl"></i>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Users</p>
                  <h3 className="text-2xl font-bold text-gray-800">3,927</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <i className="fas fa-users text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Revenue</p>
                  <h3 className="text-2xl font-bold text-gray-800">$18,430</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <i className="fas fa-chart-line text-green-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Status Table */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Inventory Status</h3>
              <button
                onClick={openAddModal}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                <i className="fas fa-plus mr-2"></i>Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3 border-b">Product</th>
                    <th className="px-4 py-3 border-b">Category</th>
                    <th className="px-4 py-3 border-b">Price</th>
                    <th className="px-4 py-3 border-b">Stock</th>
                    <th className="px-4 py-3 border-b">Status</th>
                    <th className="px-4 py-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.length > 0 ? (
                    products.slice(0, 5).map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {product.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {product.category?.name || 'No Category'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          ${product.price}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {product.stock_quantity}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              product.stock_quantity > 10
                                ? 'bg-green-100 text-green-800'
                                : product.stock_quantity > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.stock_quantity > 10
                              ? 'In Stock'
                              : product.stock_quantity > 0
                              ? 'Low Stock'
                              : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="text-gray-500 hover:text-indigo-600 cursor-pointer"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-gray-500 hover:text-red-600 cursor-pointer"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                        No products found. Add one using the button above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded mt-1"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={form.stock_quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category ID</label>
                <input
                  type="number"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
                >
                  {editingProduct ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;