import axios from 'axios';
import React from 'react';
import { useCart } from './cart';
import { useNavigate } from 'react-router-dom';

const mergeGuestCartItems = (items) => {
  const map = {};
  items.forEach(item => {
    const product = item.product_detail || item.product;
    if (!product) return;
    if (map[product.id]) {
      map[product.id].quantity += item.quantity;
    } else {
      map[product.id] = { ...item };
    }
  });
  return Object.values(map);
};

const CartPage = () => {
  const { cartItems, fetchCart } = useCart();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user');

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem('access_token');
    try {
      await axios.patch(
        `http://localhost:8000/api/cart-items/${cartItemId}/`,
        { quantity: newQuantity },
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );
      fetchCart();
    } catch (error) {
      // Check for stock error from backend
      if (
        error.response &&
        error.response.data &&
        error.response.data.detail &&
        error.response.data.detail.toLowerCase().includes('stock')
      ) {
        alert('Failed to increase quantity because of low stock');
      } else {
        alert('Failed to update quantity');
      }
    }
  };

  const removeItem = async (cartItemId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(
        `http://localhost:8000/api/cart-items/${cartItemId}/`,
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );
      fetchCart();
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.product_detail || item.product;
    return sum + (product?.price || 0) * item.quantity;
  }, 0);
  const discount = 0; 
  const shipping = 0;

  const mergedCartItems = mergeGuestCartItems(cartItems);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 mt-24 mb-12">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {mergedCartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {mergedCartItems.map((item) => {
              const product = item.product_detail || item.product;
              return (
                <div key={product.id} className="flex items-center mb-4">
                  <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded mr-4" />
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <div className="flex items-center">
                      <button
                        className="px-2 py-1 border rounded-l"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >-</button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        className="px-2 py-1 border rounded-r"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (product.stock_quantity || 0)}
                        title={item.quantity >= (product.stock_quantity || 0) ? "No more stock available" : ""}
                      >+</button>
                      <span className="ml-4 text-gray-600">
                        × Rs.{product.price}
                      </span>
                    </div>
                  </div>
                  <div className="font-semibold mr-4">Rs.{(product.price * item.quantity).toFixed(2)}</div>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => removeItem(item.id)}
                    title="Remove"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
            <div className="mt-6 text-right">
              <span className="text-xl font-bold">Total: Rs.{mergedCartItems.reduce((sum, item) => {
                const product = item.product_detail || item.product;
                return sum + (product?.price || 0) * item.quantity;
              }, 0).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="w-full md:w-1/3 bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="mb-2 flex justify-between">
          <span>Subtotal ({mergedCartItems.length} items)</span>
          <span>Rs.{subtotal.toFixed(2)}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="mb-2 flex justify-between text-green-600">
          <span>Discount</span>
          <span>-Rs.{discount.toFixed(2)}</span>
        </div>
        <hr className="my-2" />
        <div className="mb-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>Rs.{(subtotal - discount + shipping).toFixed(2)}</span>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={() => {
            if (!isLoggedIn) {
              navigate('/login');
            } else {
              navigate('/checkout');
            }
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
