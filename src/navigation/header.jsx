import React, { useState } from 'react';
import { Menu, X, ChevronDown, Phone, MessageCircle } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isSocietiesDropdownOpen, setIsSocietiesDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);

  const societies = [
    'Catholic Men Organization (CMO)',
    'Catholic Women Organization (CWO)', 
    'Catholic Youth Organization (CYO)',
    'Legion of Mary',
    'St. Vincent de Paul Society',
    'Knights of St. Mulumba'
  ];

  const aboutItems = [
    { name: 'Our Parish', link: '/about' },
    { name: 'Parish Priest', link: '/priest' },
    { name: 'Parish History', link: '/history' },
    { name: 'Mass Times', link: '/mass-times' },
    { name: 'Sacraments', link: '/sacraments' }
  ];

  const resourceItems = [
    { name: 'Homilies', link: '/homilies' },
    { name: 'Bulletins', link: '/bulletins' },
    { name: 'Gallery', link: '/gallery' },
    { name: 'Prayer Requests', link: '/prayer-requests' }
  ];

  const handleClick = (link) => {
    // In a real app, this would use your routing solution
    console.log(`Navigation to: ${link}`);
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
          <button onClick={() => handleClick('/')} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">✚</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-800">St. Francis Catholic Church</h1>
              <p className="text-sm text-gray-600">Oregun, Lagos</p>
            </div>
          </button>

          {/* Desktop Navigation - Streamlined */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button onClick={() => handleClick('/')} className="text-gray-700 hover:text-amber-800 font-medium">Home</button>
            
            {/* About Dropdown */}
            <div className="relative" onMouseEnter={() => setIsAboutDropdownOpen(true)} onMouseLeave={() => setIsAboutDropdownOpen(false)}>
              <button className="flex items-center text-gray-700 hover:text-amber-800 font-medium">
                About
                <ChevronDown size={16} className="ml-1" />
              </button>
              {isAboutDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                  {aboutItems.map((item, index) => (
                    <button key={index} onClick={() => handleClick(item.link)} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50">{item.name}</button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Societies Dropdown */}
            <div className="relative" onMouseEnter={() => setIsSocietiesDropdownOpen(true)} onMouseLeave={() => setIsSocietiesDropdownOpen(false)}>
              <button className="flex items-center text-gray-700 hover:text-amber-800 font-medium">
                Societies
                <ChevronDown size={16} className="ml-1" />
              </button>
              {isSocietiesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 z-50">
                  <button onClick={() => handleClick('/societies')} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 font-medium">All Societies</button>
                  <hr className="my-1" />
                  {societies.map((society, index) => (
                    <button key={index} onClick={() => handleClick('#')} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50">{society}</button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => handleClick('/events')} className="text-gray-700 hover:text-amber-800 font-medium">Events</button>
            
            {/* Resources Dropdown */}
            <div className="relative" onMouseEnter={() => setIsResourcesDropdownOpen(true)} onMouseLeave={() => setIsResourcesDropdownOpen(false)}>
              <button className="flex items-center text-gray-700 hover:text-amber-800 font-medium">
                Resources
                <ChevronDown size={16} className="ml-1" />
              </button>
              {isResourcesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                  {resourceItems.map((item, index) => (
                    <button key={index} onClick={() => handleClick(item.link)} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50">{item.name}</button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => handleClick('/contact')} className="text-gray-700 hover:text-amber-800 font-medium">Contact</button>
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
              <button onClick={() => handleClick('/')} className="text-left text-gray-700 hover:text-amber-800 font-medium">Home</button>
              
              {/* Mobile About Section */}
              <div className="space-y-2">
                <span className="text-gray-900 font-semibold">About</span>
                <div className="pl-4 space-y-2">
                  {aboutItems.map((item, index) => (
                    <button key={index} onClick={() => handleClick(item.link)} className="text-left block text-gray-600 hover:text-amber-800">{item.name}</button>
                  ))}
                </div>
              </div>

              {/* Mobile Societies Section */}
              <div className="space-y-2">
                <span className="text-gray-900 font-semibold">Societies</span>
                <div className="pl-4 space-y-2">
                  <button onClick={() => handleClick('/societies')} className="text-left block text-gray-600 hover:text-amber-800 font-medium">All Societies</button>
                  {societies.slice(0, 3).map((society, index) => (
                    <button key={index} onClick={() => handleClick('#')} className="text-left block text-gray-600 hover:text-amber-800 text-sm">{society}</button>
                  ))}
                  <span className="block text-gray-500 text-sm">& 3 more...</span>
                </div>
              </div>

              <button onClick={() => handleClick('/events')} className="text-left text-gray-700 hover:text-amber-800 font-medium">Events</button>
              
              {/* Mobile Resources Section */}
              <div className="space-y-2">
                <span className="text-gray-900 font-semibold">Resources</span>
                <div className="pl-4 space-y-2">
                  {resourceItems.map((item, index) => (
                    <button key={index} onClick={() => handleClick(item.link)} className="text-left block text-gray-600 hover:text-amber-800">{item.name}</button>
                  ))}
                </div>
              </div>

              <button onClick={() => handleClick('/contact')} className="text-left text-gray-700 hover:text-amber-800 font-medium">Contact</button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;