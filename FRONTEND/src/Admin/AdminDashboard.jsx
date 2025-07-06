import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaChartLine,
  FaCog,
  FaUserCircle,
  FaDollarSign,
  FaShoppingBag,
  FaChevronDown,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role !== 'admin') {
      navigate('/login', { replace: true });
      return;
    }

    setUserInfo(user);
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const handleProfile = () => {
    navigate('/admin/profile');
  };

  const handleMenuClick = (menuKey, path) => {
    setActiveMenu(menuKey);
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white w-64">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">EcomAdmin</h1>
        </div>
        <nav className="mt-6">
          <div
            className={`flex items-center p-4 cursor-pointer ${
              activeMenu === 'dashboard' ? 'bg-indigo-800' : 'hover:bg-gray-800'
            }`}
            onClick={() => handleMenuClick('dashboard', '/admin/dashboard')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleMenuClick('dashboard', '/admin/dashboard')}
          >
            <FaTachometerAlt className="text-lg" />
            <span className="ml-4">Dashboard</span>
          </div>
          <div
            className={`flex items-center p-4 cursor-pointer ${
              activeMenu === 'products' ? 'bg-indigo-800' : 'hover:bg-gray-800'
            }`}
            onClick={() => handleMenuClick('products', '/admin/products')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleMenuClick('products', '/admin/products')}
          >
            <FaBox className="text-lg" />
            <span className="ml-4">Products</span>
          </div>
          <div
            className={`flex items-center p-4 cursor-pointer ${
              activeMenu === 'orders' ? 'bg-indigo-800' : 'hover:bg-gray-800'
            }`}
            onClick={() => handleMenuClick('orders', '/admin/orders')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleMenuClick('orders', '/admin/orders')}
          >
            <FaShoppingCart className="text-lg" />
            <span className="ml-4">Orders</span>
          </div>
          <div
            className={`flex items-center p-4 cursor-pointer ${
              activeMenu === 'customers' ? 'bg-indigo-800' : 'hover:bg-gray-800'
            }`}
            onClick={() => handleMenuClick('customers', '/admin/customers')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleMenuClick('customers', '/admin/customers')}
          >
            <FaUsers className="text-lg" />
            <span className="ml-4">Customers</span>
          </div>
          <div
            className={`flex items-center p-4 cursor-pointer ${
              activeMenu === 'settings' ? 'bg-indigo-800' : 'hover:bg-gray-800'
            }`}
            onClick={() => handleMenuClick('settings', '/admin/settings')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleMenuClick('settings', '/admin/settings')}
          >
            <FaCog className="text-lg" />
            <span className="ml-4">Settings</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-end p-4 relative">
            {/* User Icon and Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((open) => !open)}
                className="flex items-center cursor-pointer select-none focus:outline-none"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <FaUserCircle className="text-gray-600 text-2xl" />
                <span className="ml-2 text-gray-700">{userInfo?.username || 'Admin User'}</span>
                <FaChevronDown className="ml-1 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                  <button
                    onClick={handleProfile}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Overview */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Sales</p>
                  <h3 className="text-2xl font-bold text-gray-800">$24,780</h3>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <FaDollarSign className="text-indigo-600 text-xl" />
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
                  <FaShoppingBag className="text-orange-600 text-xl" />
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
                  <FaUsers className="text-blue-600 text-xl" />
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
                  <FaChartLine className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
