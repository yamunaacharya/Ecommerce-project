import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Product = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
    axios.get('http://localhost:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:8000/api/products/')
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl('');
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stock_quantity: '', category: '' });
    setImage(null);
    setPreviewUrl('');
    setEditingProduct(null);
    setError('');
    setSuccess('');
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('stock_quantity', form.stock_quantity);
      formData.append('category', form.category);
      if (image) formData.append('image', image);
      const token = localStorage.getItem('access_token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
      if (editingProduct) {
        await axios.put(`http://localhost:8000/api/products/${editingProduct.id}/`, formData, config);
        setSuccess('Product updated successfully!');
      } else {
        await axios.post('http://localhost:8000/api/products/', formData, config);
        setSuccess('Product added successfully!');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(
        err.response && err.response.data
          ? JSON.stringify(err.response.data)
          : 'Failed to save product.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      category: product.category?.id || '',
    });
    setPreviewUrl(product.image ? product.image : '');
    setImage(null);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('access_token');
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
      await axios.delete(`http://localhost:8000/api/products/${id}/`, config);
      setSuccess('Product deleted successfully!');
      fetchProducts();
      if (editingProduct && editingProduct.id === id) {
        resetForm();
      }
    } catch (err) {
      setError('Failed to delete product.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProductClick = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Product Management</h2>
      {success && <div className="mb-4 text-green-600">{success}</div>}
      {error && <div className="mb-4 text-red-600 whitespace-pre-wrap">{error}</div>}
      {/* Product List Table */}
      <h3 className="text-xl font-bold mb-4">Product List</h3>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Stock</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="border border-gray-300 px-4 py-2">{p.name}</td>
                  <td className="border border-gray-300 px-4 py-2">Rs.{p.price}</td>
                  <td className="border border-gray-300 px-4 py-2">{p.stock_quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">{p.category?.name || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        onClick={handleAddProductClick}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
      >
        Add Product
      </button>
      {/* for Add/Edit Product */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <h3 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-4">
                <label className="block font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Price (Rs)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={form.stock_quantity}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Product Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="h-20 w-20 object-cover rounded border mt-2" />
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
                >
                  {loading ? (editingProduct ? 'Updating...' : 'Saving...') : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 rounded border border-gray-400 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
