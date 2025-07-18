import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './cart';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchCart } = useCart();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [id]);

  const handleAddToCart = async () => {
    setLoading(true);
    setCartMessage('');
    try {
      const token = localStorage.getItem('access_token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
      await axios.post('http://localhost:8000/api/cart-items/', { product: id, quantity }, config);
      alert(`Added ${product.name} to cart successfully!`);
      fetchCart(); // <-- update cart count
    } catch (err) {
      alert('Failed to add to cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cartMessage) {
      const timer = setTimeout(() => setCartMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [cartMessage]);

  if (!product) return <div className="mt-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-24 mb-16 p-6 bg-white rounded shadow flex flex-col md:flex-row gap-8">
      {/* Product Image */}
      <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center bg-gray-100 rounded">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-96 object-contain rounded"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      {/* Product Details */}
      <div className="flex-1">
        <div className="text-xs text-blue-600 mb-2">
          {product.category && typeof product.category === 'object'
            ? product.category.name
            : product.category_name || ''}
        </div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="mb-4 text-gray-700">{product.description}</p>
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold mr-2">Rs.{product.price}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="w-8 h-8 border rounded text-lg"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >-</button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            className="w-8 h-8 border rounded text-lg"
            onClick={() => setQuantity(q => q + 1)}
          >+</button>
          <button
            className="ml-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleAddToCart}
            disabled={loading}
          >
            Add to Cart
          </button>
        </div>
        {cartMessage && <div className="mb-2 text-green-600">{cartMessage}</div>}
      </div>
    </div>
  );
};

export default ProductDetail;
