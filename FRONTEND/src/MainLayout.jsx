import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Footer from './Components/Footer';
import AdminDashboard from './Admin/AdminDashboard';
import SignUp from './Pages/Auth/SignUp';
import Login from './Pages/Auth/Login';
import ProductList from './Admin/Product';
import CustomerDashboard from './Customer/Customerdash';  

const Layout = ({ children }) => {
  const location = useLocation();

  const noNavFooterPaths = ['/admindashboard', '/customerdashboard'];
  

  const hideNavFooter = noNavFooterPaths.includes(location.pathname);

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <main>{children}</main>
      {!hideNavFooter && <Footer />}
    </>
  );
};

const MainLayout = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/customerdashboard" element={<CustomerDashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default MainLayout;
