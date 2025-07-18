import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../Products/cart'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { category } = useParams();

  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('http://localhost:8000/api/products/')
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/categories/')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    console.log("Products:", products);
    if (products.length > 0) {
      console.log("First product:", JSON.stringify(products[0], null, 2));
    }
  }, [products]);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name.toLowerCase() : "";
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1); 
  };

  const filteredProducts = category
    ? products.filter(
        (product) =>
          getCategoryName(product.category) === category.toLowerCase()
      )
    : products;

  return (
    <div className="max-w-6xl mx-auto mt-24 mb-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">
        {category ? `Products: ${category}` : "All Products"}
      </h2>
      {category && (
        <button onClick={() => navigate('/productlist')}>
          View All Products
        </button>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {filteredProducts.length === 0 ? (
          <div>No products found in this category.</div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg flex flex-col items-stretch p-4 transition hover:shadow-lg"
              style={{ minWidth: 200, maxWidth: 240 }}
            >
              <div
                className="w-full h-52 bg-gray-100 flex items-center justify-center rounded cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </div>
              <div className="mt-2 flex-1 flex flex-col">
                <div className="text-xs text-blue-600 mb-1 truncate">
                  {product.category && typeof product.category === 'object'
                    ? product.category.name
                    : product.category_name || ''}
                </div>
                <h3 className="font-bold text-base mb-1 truncate">{product.name}</h3>
                <p className="mb-1 font-semibold text-base">Rs.{product.price}</p>
                <button
                  className="mt-auto bg-blue-500 text-white text-sm py-1 px-2 rounded hover:bg-blue-600 transition"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
