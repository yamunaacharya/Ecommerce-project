import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingBag } from 'react-icons/fa';

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);

  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-20 relative">
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
           <Link to="/Home" className="text-gray-800 hover:text-black font-medium">Home</Link>
            <Link to="" className="text-gray-800 hover:text-black font-medium">Jeans</Link>
           <Link to="" className="text-gray-800 hover:text-black font-medium">Dress</Link>
           <Link to="" className="text-gray-800 hover:text-black font-medium">T-shirts</Link>
          </nav>

          {/* Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a href="#" className="text-2xl font-bold text-black">Luxe Closet</a>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            {/* Search Section */}
            <div className="flex items-center space-x-2" ref={searchRef}>
              <FaSearch 
                className="text-gray-800 hover:text-black cursor-pointer" 
                onClick={handleSearchToggle} 
              />
              {showSearch && (
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className="w-48 px-2 py-1 border rounded-md shadow text-sm"
                  autoFocus
                />
              )}
            </div>

            {/* Shopping Bag */}
            <div className="relative">
              <FaShoppingBag className="text-gray-800 hover:text-black cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">0</span>
            </div>

            {/* User Icon */}
            <FaUser className="text-gray-800 hover:text-black cursor-pointer" />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
