import React, { useState } from 'react';
import { Menu, X, Phone, MessageCircle, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [parishGroupsDropdownOpen, setParishGroupsDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const closeAllDropdowns = () => {
    setAboutDropdownOpen(false);
    setParishGroupsDropdownOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    closeAllDropdowns();
  };

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
          <Link to="/" className="flex items-center space-x-3" onClick={handleLinkClick}>
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
            <Link to="/" className={`font-medium ${isActive('/') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`} onClick={closeAllDropdowns}>Home</Link>
            
            {/* About Us Dropdown */}
            <div className="relative">
              <button 
                className={`font-medium flex items-center space-x-1 ${isActive('/about') || isActive('/contact') || isActive('/gallery') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}
                onClick={() => {
                  setAboutDropdownOpen(!aboutDropdownOpen);
                  setParishGroupsDropdownOpen(false);
                }}
              >
                <span>About Us</span>
                <ChevronDown size={16} className={`transform transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                  <Link to="/about/parish-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800" onClick={closeAllDropdowns}>Parish History</Link>
                  <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800" onClick={closeAllDropdowns}>Contact Us</Link>
                  <Link to="/gallery" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800" onClick={closeAllDropdowns}>Gallery</Link>
                </div>
              )}
            </div>

            {/* Parish Groups Dropdown */}
            <div className="relative">
              <button 
                className={`font-medium flex items-center space-x-1 ${isActive('/parish-groups') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}
                onClick={() => {
                  setParishGroupsDropdownOpen(!parishGroupsDropdownOpen);
                  setAboutDropdownOpen(false);
                }}
              >
                <span>Parish Groups</span>
                <ChevronDown size={16} className={`transform transition-transform ${parishGroupsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {parishGroupsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
<Link to="/parish-groups/societies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800" onClick={closeAllDropdowns}>Societies & Organizations</Link>               
                </div>
              )}
            </div>

            <Link to="/events" className={`font-medium ${isActive('/events') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`} onClick={closeAllDropdowns}>Events</Link>
            <Link to="/blog" className={`font-medium ${isActive('/blog') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`} onClick={closeAllDropdowns}>Blog</Link>
            <Link to="/donation" className={`font-medium ${isActive('/donation') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`} onClick={closeAllDropdowns}>Donation</Link>
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
              <Link to="/" onClick={handleLinkClick} className={`text-left font-medium ${isActive('/') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>Home</Link>
              
              {/* Mobile About Us Section */}
              <div>
                <button 
                  className={`text-left font-medium flex items-center justify-between w-full ${isActive('/about') || isActive('/contact') || isActive('/gallery') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}
                  onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                >
                  <span>About Us</span>
                  <ChevronDown size={16} className={`transform transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {aboutDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    <Link to="/about/parish-history" onClick={handleLinkClick} className="block text-sm text-gray-600 hover:text-amber-800">Parish History</Link>
                    <Link to="/contact" onClick={handleLinkClick} className="block text-sm text-gray-600 hover:text-amber-800">Contact Us</Link>
                    <Link to="/gallery" onClick={handleLinkClick} className="block text-sm text-gray-600 hover:text-amber-800">Gallery</Link>
                  </div>
                )}
              </div>

              {/* Mobile Parish Groups Section */}
              <div>
                <button 
                  className={`text-left font-medium flex items-center justify-between w-full ${isActive('/parish-groups') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}
                  onClick={() => setParishGroupsDropdownOpen(!parishGroupsDropdownOpen)}
                >
                  <span>Parish Groups</span>
                  <ChevronDown size={16} className={`transform transition-transform ${parishGroupsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {parishGroupsDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    <Link to="/parish-groups/pastoral" onClick={handleLinkClick} className="block text-sm text-gray-600 hover:text-amber-800">Pastoral</Link>
                    <Link to="/parish-groups/organs" onClick={handleLinkClick} className="block text-sm text-gray-600 hover:text-amber-800">Organs of the Church</Link>
                    <Link to="/parish-groups/scc" onClick={handleLinkClick} className="block text-sm text-gray-600 hover:text-amber-800">Small Christian Community</Link>
                  </div>
                )}
              </div>

              <Link to="/events" onClick={handleLinkClick} className={`text-left font-medium ${isActive('/events') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>Events</Link>
              <Link to="/blog" onClick={handleLinkClick} className={`text-left font-medium ${isActive('/blog') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>Blog</Link>
              <Link to="/donation" onClick={handleLinkClick} className={`text-left font-medium ${isActive('/donation') ? 'text-amber-800' : 'text-gray-700 hover:text-amber-800'}`}>Donation</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;