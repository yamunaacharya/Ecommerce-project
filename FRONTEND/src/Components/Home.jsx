import React, { useState } from 'react';

const Home = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const trendingItems = [
    { id: 1, name: 'Classic White Shirt', price: 59.99, image: '' },
    { id: 2, name: 'Denim Jacket', price: 89.99, image: '' },
    { id: 3, name: 'Silk Skirt', price: 49.99, image: '' },
    { id: 4, name: 'Linen Trousers', price: 69.99, image: '' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-20 h-screen max-h-[800px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=elegant%20minimalist%20fashion%20photoshoot%20with%20model%20wearing%20stylish%20modern%20clothing%20against%20neutral%20background%2C%20soft%20natural%20lighting%2C%20high-end%20fashion%20photography%2C%20professional%20composition%20with%20gradient%20white%20background%20on%20left%20side%20for%20text%20overlay%2C%20atmospheric&width=1440&height=800&seq=hero1&orientation=landscape')`,
          }}
        ></div>

        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-lg">
            <h1 className="text-5xl font-light text-gray-900 mb-4">Spring Collection 2025</h1>
            <p className="text-xl text-gray-700 mb-8">
              Discover our latest designs crafted with sustainable materials and timeless aesthetics.
            </p>
            <button className="bg-black text-white px-8 py-3 text-lg font-medium hover:bg-gray-900 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Trending Items Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">Trending Now</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingItems.map((item) => (
              <div
                key={item.id}
                className="group relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative overflow-hidden bg-gray-100 aspect-[4/5] rounded-md shadow-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Bottom overlay buttons */}
                  {hoveredItem === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-full bg-black text-white py-2 text-sm font-medium hover:bg-gray-900 transition">
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <h3 className="text-gray-900 font-medium">{item.name}</h3>
                  <div className="flex items-center justify-center mt-1">
                    <span className="text-gray-900 font-medium">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="border border-black text-black px-8 py-3 font-medium hover:bg-black hover:text-white transition-colors">
              View All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
