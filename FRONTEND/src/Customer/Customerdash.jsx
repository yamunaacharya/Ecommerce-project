import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaUser,
  FaCog,
  FaUserCircle,
} from 'react-icons/fa';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { key: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
  { key: 'profile', label: 'Profile', icon: <FaUser /> },
  { key: 'settings', label: 'Settings', icon: <FaCog /> },
];

const CustomerDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Determine the active menu based on the current path
  const activeMenu = menuItems.find(item =>
    location.pathname.includes(item.key)
  )?.key || 'dashboard';

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Redirect if no user or user role is not 'customer'
    if (!user || user.role !== 'customer') {
      navigate('/login', { replace: true });
      return;
    }

    setUserInfo(user);
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white w-64 flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Customer Dashboard</h1>
        </div>
        <nav className="mt-6 flex-1">
          {menuItems.map(menu => (
            <div
              key={menu.key}
              className={`flex items-center p-4 cursor-pointer select-none ${
                activeMenu === menu.key ? 'bg-indigo-800' : 'hover:bg-gray-800'
              }`}
              onClick={() => navigate(`/${menu.key}`)}
              role="button"
              tabIndex={0}
              onKeyPress={e => e.key === 'Enter' && navigate(`/${menu.key}`)}
              aria-current={activeMenu === menu.key ? 'page' : undefined}
            >
              <div className="text-lg">{menu.icon}</div>
              <span className="ml-4 capitalize">{menu.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {menuItems.find(item => item.key === activeMenu)?.label || ''}
            </h2>
            <div className="flex items-center space-x-4">
              <div
                className="flex items-center px-3 py-1 bg-gray-100 rounded-full shadow cursor-pointer hover:bg-gray-200 transition select-none"
                aria-label="User profile"
              >
                <FaUserCircle className="text-indigo-600 text-2xl mr-2" />
                <span className="text-gray-800 font-medium">{userInfo?.username || 'Customer'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Outlet for nested routes */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
