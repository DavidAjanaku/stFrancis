import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const Footer = () => {
  const handleClick = (link) => {
    // In a real app, this would use your routing solution
    console.log(`Navigation to: ${link}`);
  };

  return (
    <footer className="bg-amber-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-amber-900 font-bold text-lg">✚</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">St. Francis Catholic Church</h3>
                <p className="text-sm text-amber-200">Oregun, Lagos</p>
              </div>
            </div>
            <p className="text-amber-200 text-sm mb-4">
              A vibrant Catholic community committed to worship, fellowship, and service to God and our neighbors.
            </p>
            <div className="flex space-x-3">
              <button onClick={() => handleClick('#')} className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors">
                <span className="text-xs">📘</span>
              </button>
              <button onClick={() => handleClick('#')} className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors">
                <span className="text-xs">📷</span>
              </button>
              <button onClick={() => handleClick('#')} className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors">
                <span className="text-xs">📺</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => handleClick('/about')} className="text-amber-200 hover:text-white transition-colors text-left">About Us</button></li>
              <li><button onClick={() => handleClick('/mass-sacraments')} className="text-amber-200 hover:text-white transition-colors text-left">Mass Times</button></li>
              <li><button onClick={() => handleClick('/societies')} className="text-amber-200 hover:text-white transition-colors text-left">Societies</button></li>
              <li><button onClick={() => handleClick('/events')} className="text-amber-200 hover:text-white transition-colors text-left">Events</button></li>
              <li><button onClick={() => handleClick('/homilies')} className="text-amber-200 hover:text-white transition-colors text-left">Homilies</button></li>
              <li><button onClick={() => handleClick('/gallery')} className="text-amber-200 hover:text-white transition-colors text-left">Gallery</button></li>
              <li><button onClick={() => handleClick('/bulletins')} className="text-amber-200 hover:text-white transition-colors text-left">Bulletins</button></li>
              <li><button onClick={() => handleClick('/prayer-requests')} className="text-amber-200 hover:text-white transition-colors text-left">Prayer Requests</button></li>
            </ul>
          </div>

          {/* Mass Times */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Mass Times</h4>
            <div className="space-y-2 text-sm text-amber-200">
              <div className="flex items-center space-x-2">
                <Clock size={14} />
                <div>
                  <p className="font-medium text-white">Sunday</p>
                  <p>7:00 AM, 9:00 AM, 11:00 AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={14} />
                <div>
                  <p className="font-medium text-white">Weekdays</p>
                  <p>6:30 AM, 12:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={14} />
                <div>
                  <p className="font-medium text-white">Saturday Vigil</p>
                  <p>6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-amber-300 mt-1 flex-shrink-0" />
                <div className="text-amber-200">
                  <p>123 Church Street</p>
                  <p>Oregun, Lagos State</p>
                  <p>Nigeria</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-amber-300" />
                <span className="text-amber-200">+234 xxx xxx xxxx</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle size={16} className="text-amber-300" />
                <span className="text-amber-200">WhatsApp Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-amber-300" />
                <span className="text-amber-200">info@stfrancisoregun.org</span>
              </div>
            </div>

            {/* Office Hours */}
            <div className="mt-4 p-3 bg-amber-800 rounded-lg">
              <h5 className="font-medium mb-2">Office Hours</h5>
              <div className="text-xs text-amber-200 space-y-1">
                <p>Monday - Friday: 9:00 AM - 4:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Sunday: After Mass</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-amber-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-amber-300">
            <p>&copy; 2024 St. Francis Catholic Church, Oregun. All rights reserved.</p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <button onClick={() => handleClick('/privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => handleClick('/terms')} className="hover:text-white transition-colors">Terms of Service</button>
              <span>Built with ❤️ for our Parish</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;