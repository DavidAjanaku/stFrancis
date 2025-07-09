import React, { useState } from 'react';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Contact Bar */}
      <div className="bg-amber-900 text-white py-2">
        <div className="container mx-auto px-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone size={14} />
                <span>+234 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle size={14} />
                <span>WhatsApp Us</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>info@stfrancisoregun.org</span>
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex flex-col space-y-1 text-xs">
              <div className="flex items-center justify-center space-x-1">
                <Phone size={12} />
                <span>+234 123 456 7890</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <MessageCircle size={12} />
                <span>WhatsApp Us</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">✚</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-800">St. Francis Catholic Church</h1>
              <p className="text-sm text-gray-600">Oregun, Lagos</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className={`font-medium ${isActive('/') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>Home</Link>
            <Link to="/about" className={`font-medium ${isActive('/about') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>About Us</Link>
            <Link to="/events" className={`font-medium ${isActive('/events') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>Events</Link>
            <Link to="/blog" className={`font-medium ${isActive('/blog') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>Blog</Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className={`text-left font-medium ${isActive('/') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>Home</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className={`text-left font-medium ${isActive('/about') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>About Us</Link>
              <Link to="/events" onClick={() => setIsMenuOpen(false)} className={`text-left font-medium ${isActive('/events') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>Events</Link>
              <Link to="/blog" onClick={() => setIsMenuOpen(false)} className={`text-left font-medium ${isActive('/blog') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>Blog</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className={`text-left font-medium ${isActive('/contact') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>Contact Us</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;