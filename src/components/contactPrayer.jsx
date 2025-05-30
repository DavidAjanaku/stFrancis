import React, { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactPrayer = () => {
  const [prayerRequest, setPrayerRequest] = useState('');

  const handlePrayerSubmit = () => {
    if (prayerRequest) {
      alert('Your prayer request has been submitted. God bless you!');
      setPrayerRequest('');
    }
  };

  return (
    <section className="py-16 px-4 fade-in opacity-0 transition-opacity duration-1000">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-primary">Contact Us</h2>
            <div className="space-y-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-primary mr-4" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-600 dark:text-gray-300">123 Church Street, Anytown, ST 12345</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-primary mr-4" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-gray-600 dark:text-gray-300">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-primary mr-4" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-600 dark:text-gray-300">info@stmarysparish.org</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prayer Request Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-primary">Prayer Requests</h2>
            <div className="space-y-4">
              <textarea
                value={prayerRequest}
                onChange={(e) => setPrayerRequest(e.target.value)}
                placeholder="Share your prayer request..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                rows="6"
              />
              <button
                onClick={handlePrayerSubmit}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Submit Prayer Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPrayer;