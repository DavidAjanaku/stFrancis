import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Instagram, Youtube, Link, Settings } from 'lucide-react';

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch('https://distinct-stranger-production.up.railway.app/api/footer');
        if (!response.ok) {
          throw new Error('Failed to fetch footer data');
        }
        const data = await response.json();
        setFooterData(data);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFooterData();
  }, []);

  const handleClick = (link) => {
    // For admin link, use window.location to navigate
    if (link === '/admin') {
      window.location.href = '/admin';
    } else {
      // Open external links in a new tab
      window.open(link, '_blank');
    }
  };

  if (isLoading) {
    return (
      <footer className="bg-amber-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>Loading footer content...</p>
        </div>
      </footer>
    );
  }

  if (!footerData) {
    return (
      <footer className="bg-amber-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>Footer content unavailable</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-amber-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-amber-900 font-bold text-lg">
                  {footerData.churchInfo.logo || '✚'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {footerData.churchInfo.name || 'Church Name'}
                </h3>
                <p className="text-sm text-amber-200">
                  {footerData.churchInfo.location || 'Location'}
                </p>
              </div>
            </div>
            <p className="text-amber-200 text-sm mb-4">
              {footerData.churchInfo.description || 'Church description'}
            </p>
            <div className="flex space-x-3">
              {footerData.socialMedia.facebook.enabled && (
                <button 
                  onClick={() => handleClick(footerData.socialMedia.facebook.url)} 
                  className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors"
                >
                  <Facebook size={16} />
                </button>
              )}
              {footerData.socialMedia.instagram.enabled && (
                <button 
                  onClick={() => handleClick(footerData.socialMedia.instagram.url)} 
                  className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors"
                >
                  <Instagram size={16} />
                </button>
              )}
              {footerData.socialMedia.youtube.enabled && (
                <button 
                  onClick={() => handleClick(footerData.socialMedia.youtube.url)} 
                  className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors"
                >
                  <Youtube size={16} />
                </button>
              )}
              <button 
                onClick={() => handleClick('https://linktr.ee/StFrancisOregun?utm_source=linktree_profile_share&ltsid=ee016b89-af0d-4f15-a8f9-6e1cca54e9b5')} 
                className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors"
              >
                <Link size={16} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleClick(link.url)} 
                    className="text-amber-200 hover:text-white transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-amber-300 mt-1 flex-shrink-0" />
                <div className="text-amber-200">
                  <p>{footerData.contactInfo.address.street}</p>
                  <p>{footerData.contactInfo.address.city}</p>
                  <p>{footerData.contactInfo.address.country}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-amber-300" />
                <span className="text-amber-200">{footerData.contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-amber-300" />
                <span className="text-amber-200">{footerData.contactInfo.email}</span>
              </div>
            </div>

            {/* Office Hours */}
            <div className="mt-4 p-3 bg-amber-800 rounded-lg">
              <h5 className="font-medium mb-2">Office Hours</h5>
              <div className="text-xs text-amber-200 space-y-2">
                <div>
                  <p className="font-medium text-amber-100">Parish Office:</p>
                  <p>Monday to Friday: 9am to 4pm</p>
                </div>
                <div>
                  <p className="font-medium text-amber-100">Parish Priest Office Hours:</p>
                  <p>Tuesday and Friday: 9am to 1:30pm</p>
                </div>
                <div>
                  <p className="font-medium text-amber-100">Associate Priest Office Hours:</p>
                  <p>Monday and Wednesday: 9am to 1:30pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-amber-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-amber-300">
            <p>
              &copy; {new Date().getFullYear()} {footerData.churchInfo.name || 'Church Name'}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;