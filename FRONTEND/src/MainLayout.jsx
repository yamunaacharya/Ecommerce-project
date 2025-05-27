import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Footer from './Components/Footer';

const MainLayout = () => {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Home />
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default MainLayout;
