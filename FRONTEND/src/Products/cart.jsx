import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const config = {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        };
        const res = await axios.get('http://localhost:8000/api/cart-items/', config);
        setCartItems(res.data);
        const count = res.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch (error) {
        console.error("Error fetching cart:", error.response || error.message || error);
        setCartItems([]);
        setCartCount(0);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      setCartItems(guestCart);
      setCartCount(guestCart.reduce((sum, item) => sum + item.quantity, 0));
    }
  };

  const addToCart = async (product, qty = 1) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const config = {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        };
        await axios.post(
          'http://localhost:8000/api/cart-items/',
          { product: product.id, quantity: qty },
          config
        );
        await fetchCart();
        alert(`Added ${product.name} to cart successfully!`);
      } catch (error) {
        console.error('Failed to add to cart:', error.response || error.message || error);
        if (error.response && error.response.status === 401) {
          alert('Failed to add to cart: Please log in.');
        } else if (error.response && error.response.data) {
          alert(`Failed to add to cart: ${JSON.stringify(error.response.data)}`);
        } else {
          alert('Failed to add to cart. Please try again later.');
        }
      }
    } else {
      try {
        let guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const existing = guestCart.find(item => item.product.id === product.id);
        if (existing) {
          existing.quantity += qty;
        } else {
          guestCart.push({ product, quantity: qty });
        }
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
        setCartItems(guestCart);
        setCartCount(guestCart.reduce((sum, item) => sum + item.quantity, 0));
        await fetchCart();
        alert(`Added ${product.name} to cart successfully!`);
      } catch (error) {
        console.error('Failed to add to cart (guest):', error);
        alert('Failed to add to cart. Please try again later.');
      }
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
