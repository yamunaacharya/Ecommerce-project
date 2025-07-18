import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Footer from './Components/Footer';
import AdminDashboard from './Admin/AdminDashboard';
import SignUp from './Pages/Auth/SignUp';
import Login from './Pages/Auth/Login';
import Product from './Admin/Product';
import CustomerDashboard from './Customer/Customerdash';
import ProductList from './Products/ProductList';
import Productdetail from './Products/Productdetails';
import { CartProvider } from './Products/cart';
import CartPage from './Products/CartPage';
import CheckoutPage from './Products/CheckoutPage';
import Customers from './Admin/CustomerManage';
import OrderConfirmation from './Products/OrderConfirmation';
import UserOrders from './Customer/UserOrders';
import AdminOrders from './Admin/AdminOrders';

const Layout = ({ children }) => {
  const location = useLocation();

  const noNavFooterPaths = ['/admindashboard', '/customerdashboard', '/products', '/admin/customers', '/admin/orders'];

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
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/customerdashboard" element={<CustomerDashboard />} />
            <Route path="/products" element={<Product />} />
            <Route path="/productlist" element={<ProductList />} />
            <Route path="/productlist/:category" element={<ProductList />} />
            <Route path="/product/:id" element={<Productdetail />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<CartPage />} />            
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/my-orders" element={<UserOrders />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
};

export default MainLayout;
