import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-100 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-medium mb-4">Shop</h3>
              <ul className="space-y-2">
                 <li><a href="#" className="text-gray-600 hover:text-black cursor-pointer">Home</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black cursor-pointer">Jeans</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black cursor-pointer">Dress</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black cursor-pointer">T-shirts</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Help</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-black cursor-pointer">FAQ</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black cursor-pointer">Shipping & Returns</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black cursor-pointer">Store Locator</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black cursor-pointer">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-black cursor-pointer">Our Story</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black cursor-pointer">Sustainability</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black cursor-pointer">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black cursor-pointer">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Stay Connected</h3>
              <p className="text-gray-600 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
              
              <div className="flex mb-6">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="border-b border-gray-300 bg-transparent py-2 px-0 flex-grow focus:outline-none focus:border-black text-sm"
                />
                <button className="ml-2 bg-black text-white px-4 py-2 text-sm cursor-pointer !rounded-button whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-black cursor-pointer">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-black cursor-pointer">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-black cursor-pointer">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-black cursor-pointer">
                  <i className="fab fa-pinterest text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 Luxe Closet. All rights reserved.</p>
              
              <div className="flex space-x-4">
                <i className="fab fa-cc-visa text-gray-400 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    
  )
}

export default Footer



