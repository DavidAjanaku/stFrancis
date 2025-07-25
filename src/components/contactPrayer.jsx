import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactPrayer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    prayerRequest: ''
  });

  const [contactInfo, setContactInfo] = useState({
    address: '123 Church Street, Anytown, ST 12345',
    phone: '(555) 123-4567',
    email: 'info@stmarysparish.org'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrayerSubmit = async () => {
    if (!formData.prayerRequest) {
      setSubmitStatus({ type: 'error', message: 'Please enter your prayer request' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://distinct-stranger-production.up.railway.app/api/prayer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ name: '', email: '', prayerRequest: '' });
        setSubmitStatus({ 
          type: 'success', 
          message: 'Your prayer request has been submitted. God bless you!' 
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit prayer request');
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'An error occurred. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

    useEffect(() => {
      const fetchContactInfo = async () => {
        try {
          const response = await fetch('https://distinct-stranger-production.up.railway.app/api/contact');
          const data = await response.json();
          setContactInfo(data);
        } catch (error) {
          console.error('Failed to fetch contact info:', error);
        }
      };
      
      fetchContactInfo();
    }, []);

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
                  <p className="text-gray-600 dark:text-gray-300">{contactInfo.address}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-primary mr-4" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-gray-600 dark:text-gray-300">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-primary mr-4" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-600 dark:text-gray-300">{contactInfo.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prayer Request Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-primary">Prayer Requests</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name (Optional)</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prayer Request *</label>
                <textarea
                  name="prayerRequest"
                  value={formData.prayerRequest}
                  onChange={handleChange}
                  placeholder="Share your prayer request..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="6"
                />
              </div>
              
              {submitStatus && (
                <div className={`p-3 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitStatus.message}
                </div>
              )}
              
              <button
                onClick={handlePrayerSubmit}
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Prayer Request'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPrayer;