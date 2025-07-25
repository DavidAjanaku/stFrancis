import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit3, Clock, MapPin, Phone, Mail, MessageCircle, Facebook, Instagram, Youtube, AlertCircle } from 'lucide-react';

const FooterAdmin = () => {
  const [activeTab, setActiveTab] = useState('church-info');
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize states
  const [churchInfo, setChurchInfo] = useState({
    name: '',
    location: '',
    description: '',
    logo: '✚'
  });
  
  const [contactInfo, setContactInfo] = useState({
    address: { street: '', city: '', country: '' },
    phone: '',
    email: '',
    whatsapp: false
  });
  
  const [officeHours, setOfficeHours] = useState({
    weekdays: '',
    saturday: '',
    sunday: ''
  });
  
  const [massTimes, setMassTimes] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  
  const [socialMedia, setSocialMedia] = useState({
    facebook: { enabled: false, url: '#' },
    instagram: { enabled: false, url: '#' },
    youtube: { enabled: false, url: '#' }
  });

  // Fetch footer data on component mount
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch('https://distinct-stranger-production.up.railway.app/api/footer');
        if (!response.ok) {
          throw new Error('Failed to fetch footer data');
        }
        const data = await response.json();
        
        setChurchInfo(data.churchInfo || {
          name: '',
          location: '',
          description: '',
          logo: '✚'
        });
        
        setContactInfo(data.contactInfo || {
          address: { street: '', city: '', country: '' },
          phone: '',
          email: '',
          whatsapp: false
        });
        
        setOfficeHours(data.officeHours || {
          weekdays: '',
          saturday: '',
          sunday: ''
        });
        
        setMassTimes(data.massTimes || []);
        setQuickLinks(data.quickLinks || []);
        
        setSocialMedia(data.socialMedia || {
          facebook: { enabled: false, url: '#' },
          instagram: { enabled: false, url: '#' },
          youtube: { enabled: false, url: '#' }
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching footer data:', error);
        setIsLoading(false);
      }
    };
    
    fetchFooterData();
  }, []);

  // Handle save button click
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://distinct-stranger-production.up.railway.app/api/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          churchInfo,
          contactInfo,
          officeHours,
          massTimes,
          quickLinks,
          socialMedia
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save footer data');
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving footer data:', error);
    }
  };

  const addMassTime = () => {
    setMassTimes([...massTimes, { day: '', times: '' }]);
  };

  const removeMassTime = (index) => {
    setMassTimes(massTimes.filter((_, i) => i !== index));
  };

  const updateMassTime = (index, field, value) => {
    const updated = massTimes.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setMassTimes(updated);
  };

  const addQuickLink = () => {
    setQuickLinks([...quickLinks, { name: '', url: '' }]);
  };

  const removeQuickLink = (index) => {
    setQuickLinks(quickLinks.filter((_, i) => i !== index));
  };

  const updateQuickLink = (index, field, value) => {
    const updated = quickLinks.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setQuickLinks(updated);
  };

  const tabs = [
    { id: 'church-info', label: 'Church Info', icon: Edit3 },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'mass-times', label: 'Mass Times', icon: Clock },
    { id: 'quick-links', label: 'Quick Links', icon: Plus },
    { id: 'social-media', label: 'Social Media', icon: MessageCircle }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading footer settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Footer Administration</h1>
              <p className="text-sm text-gray-600">Manage your church footer content and settings</p>
            </div>
            <button
              onClick={handleSave}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mx-4 mt-4">
          <div className="flex items-center">
            <AlertCircle className="text-green-600 mr-2" size={16} />
            <span className="text-green-800">Footer settings saved successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Church Information Tab */}
              {activeTab === 'church-info' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Church Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Church Name</label>
                      <input
                        type="text"
                        value={churchInfo.name}
                        onChange={(e) => setChurchInfo({...churchInfo, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={churchInfo.location}
                        onChange={(e) => setChurchInfo({...churchInfo, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={churchInfo.description}
                        onChange={(e) => setChurchInfo({...churchInfo, description: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo Symbol</label>
                      <input
                        type="text"
                        value={churchInfo.logo}
                        onChange={(e) => setChurchInfo({...churchInfo, logo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter symbol (e.g., ✚)"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                          <input
                            type="text"
                            value={contactInfo.address.street}
                            onChange={(e) => setContactInfo({
                              ...contactInfo,
                              address: {...contactInfo.address, street: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City, State</label>
                          <input
                            type="text"
                            value={contactInfo.address.city}
                            onChange={(e) => setContactInfo({
                              ...contactInfo,
                              address: {...contactInfo.address, city: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                          <input
                            type="text"
                            value={contactInfo.address.country}
                            onChange={(e) => setContactInfo({
                              ...contactInfo,
                              address: {...contactInfo.address, country: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Contact Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="text"
                            value={contactInfo.phone}
                            onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            value={contactInfo.email}
                            onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={contactInfo.whatsapp}
                            onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.checked})}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">WhatsApp Available</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Office Hours</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Monday - Friday</label>
                          <input
                            type="text"
                            value={officeHours.weekdays}
                            onChange={(e) => setOfficeHours({...officeHours, weekdays: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Saturday</label>
                          <input
                            type="text"
                            value={officeHours.saturday}
                            onChange={(e) => setOfficeHours({...officeHours, saturday: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sunday</label>
                          <input
                            type="text"
                            value={officeHours.sunday}
                            onChange={(e) => setOfficeHours({...officeHours, sunday: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mass Times Tab */}
              {activeTab === 'mass-times' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Mass Times</h2>
                    <button
                      onClick={addMassTime}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Add Mass Time</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {massTimes.map((massTime, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Day (e.g., Sunday)"
                            value={massTime.day}
                            onChange={(e) => updateMassTime(index, 'day', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div className="flex-2">
                          <input
                            type="text"
                            placeholder="Times (e.g., 7:00 AM, 9:00 AM)"
                            value={massTime.times}
                            onChange={(e) => updateMassTime(index, 'times', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <button
                          onClick={() => removeMassTime(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links Tab */}
              {activeTab === 'quick-links' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Quick Links</h2>
                    <button
                      onClick={addQuickLink}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Add Link</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {quickLinks.map((link, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Link Name"
                            value={link.name}
                            onChange={(e) => updateQuickLink(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="URL (e.g., /about)"
                            value={link.url}
                            onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <button
                          onClick={() => removeQuickLink(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Media Tab */}
              {activeTab === 'social-media' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Social Media</h2>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <Facebook className="text-blue-600" size={24} />
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                        <input
                          type="text"
                          value={socialMedia.facebook.url}
                          onChange={(e) => setSocialMedia({
                            ...socialMedia,
                            facebook: {...socialMedia.facebook, url: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          placeholder="https://facebook.com/yourpage"
                        />
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={socialMedia.facebook.enabled}
                          onChange={(e) => setSocialMedia({
                            ...socialMedia,
                            facebook: {...socialMedia.facebook, enabled: e.target.checked}
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Enabled</span>
                      </label>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <Instagram className="text-pink-600" size={24} />
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                        <input
                          type="text"
                          value={socialMedia.instagram.url}
                          onChange={(e) => setSocialMedia({
                            ...socialMedia,
                            instagram: {...socialMedia.instagram, url: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          placeholder="https://instagram.com/yourpage"
                        />
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={socialMedia.instagram.enabled}
                          onChange={(e) => setSocialMedia({
                            ...socialMedia,
                            instagram: {...socialMedia.instagram, enabled: e.target.checked}
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Enabled</span>
                      </label>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <Youtube className="text-red-600" size={24} />
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                        <input
                          type="text"
                          value={socialMedia.youtube.url}
                          onChange={(e) => setSocialMedia({
                            ...socialMedia,
                            youtube: {...socialMedia.youtube, url: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          placeholder="https://youtube.com/yourchannel"
                        />
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={socialMedia.youtube.enabled}
                          onChange={(e) => setSocialMedia({
                            ...socialMedia,
                            youtube: {...socialMedia.youtube, enabled: e.target.checked}
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Enabled</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterAdmin;