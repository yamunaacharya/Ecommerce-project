import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Footer from './Components/Footer';
import Dress from './Products/Dress';
import Jeans from './Products/Jeans';
import Tshirt from './Products/Tshirt';
import AdminDashboard from './Admin/Dashboard';


const MainLayout = () => {
  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/jeans" element={<Jeans />} />
        <Route path="/dress" element={<Dress />} />
        <Route path="/tshirts" element={<Tshirt />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default MainLayout;