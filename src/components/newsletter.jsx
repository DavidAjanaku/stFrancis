import React, { useState } from 'react';
import { Send } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  
  const handleNewsletterSubmit = () => {
    if (email) {
      alert('Thank you for subscribing to our newsletter!');
      setEmail('');
    }
  };

  return (
    <section className="py-16 px-4 bg-blue-600 text-white fade-in opacity-0 transition-opacity duration-1000">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
        <p className="text-xl mb-8">Subscribe to our newsletter for updates on events, announcements, and parish news.</p>
        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <button
            onClick={handleNewsletterSubmit}
            className="bg-secondary text-primary px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors font-semibold flex items-center justify-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;