import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../Products/cart';  

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const { cartCount } = useCart(); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
    navigate('/login');
  };

  const handleSearchToggle = () => {
    setShowSearch(prev => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setShowSearch(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current && !searchRef.current.contains(e.target) &&
        userMenuRef.current && !userMenuRef.current.contains(e.target)
      ) {
        setShowSearch(false);
        setShowUserMenu(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowUserMenu(false);
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
            <Link to="/home" className="text-gray-800 hover:text-black font-medium">Home</Link>
            <Link to="/productlist" className="text-gray-800 hover:text-black font-medium">New Arrival</Link>
            <Link to="/productlist" className="text-gray-800 hover:text-black font-medium">sale</Link>
          </nav>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="text-2xl font-bold text-black">Luxe Closet</Link>
          </div>

          <div className="flex items-center space-x-6">

            <div className="flex items-center space-x-2 relative" ref={searchRef}>
              <FaSearch
                className="text-gray-800 hover:text-black cursor-pointer"
                onClick={handleSearchToggle}
              />
              {showSearch && (
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className="w-48 px-2 py-1 border rounded-md shadow text-sm focus:outline-none"
                    autoFocus
                  />
                </form>
              )}
            </div>

            <div
              className="relative cursor-pointer"
              onClick={() => navigate('/cart')}
              aria-label="Go to cart"
              title="Cart"
            >
              <FaShoppingBag
                className="text-gray-800 hover:text-black"
                size={20}
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                  {cartCount}
                </span>
              )}
            </div>

            <div className="flex items-center relative" ref={userMenuRef}>
              {user && (
                <span className="mr-2 text-gray-800 font-semibold hidden sm:inline">
                  Wlc, {user.username}
                </span>
              )}

              <FaUser
                className="text-gray-800 hover:text-black cursor-pointer transition-transform duration-200 transform hover:scale-110"
                onClick={() => setShowUserMenu(prev => !prev)}
              />

              <div
                className={`absolute right-0 top-full mt-1 w-40 bg-white border rounded-lg shadow-lg z-10 overflow-hidden transition-all duration-300 ease-in-out origin-top ${
                  showUserMenu
                    ? 'opacity-100 scale-y-100 pointer-events-auto'
                    : 'opacity-0 scale-y-0 pointer-events-none'
                }`}
              >
                <ul className="py-1 text-sm font-medium text-gray-700">
                  {user ? (
                    <>
                      <li>
                        <button
                          onClick={() => {
                            navigate('/customerdashboard');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          Dashboard
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          to="/login"
                          className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span className="mr-2">🔐</span> Login
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/signup"
                          className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span className="mr-2">📝</span> Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
