import React from 'react';

const Home = () => {
  const categories = [
    {
      id: 1,
      name: 'Pants',
      image: 'https://via.placeholder.com/300x300?text=Pants',
    },
    {
      id: 2,
      name: 'Dress',
      image: 'https://via.placeholder.com/300x300?text=Dress',
    },
    {
      id: 3,
      name: 'T-Shirts',
      image: 'https://via.placeholder.com/300x300?text=T-Shirts',
    },
    {
      id: 4,
      name: 'Jackets',
      image: 'https://via.placeholder.com/300x300?text=Jackets',
    },
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

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="text-center group">
                <div className="overflow-hidden rounded-md shadow-md aspect-square bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
