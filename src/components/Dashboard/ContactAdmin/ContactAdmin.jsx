import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Edit2, Save, X, Settings, Check } from 'lucide-react';

// Move ContactField outside of the main component to prevent recreation on every render
const ContactField = ({ field, icon: Icon, label, value, editingField, tempValue, setTempValue, handleEdit, handleSave, handleCancel }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Icon className="h-6 w-6 text-primary mr-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{label}</h3>
      </div>
      {editingField !== field && (
        <button
          onClick={() => handleEdit(field)}
          className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      )}
    </div>
    
    {editingField === field ? (
      <div className="space-y-3">
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder={`Enter ${label.toLowerCase()}`}
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleSave(field)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <p className="text-gray-600 dark:text-gray-300 text-lg">{value}</p>
    )}
  </div>
);

const ContactAdmin = () => {
  const [contactInfo, setContactInfo] = useState({
    address: 'Loading...',
    phone: 'Loading...',
    email: 'Loading...'
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  const handleEdit = (field) => {
    setEditingField(field);
    setTempValue(contactInfo[field]);
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        // Use consistent API endpoint
        const response = await fetch('http://localhost:5001/api/contact');
        
        // Check if response is OK before parsing
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response');
        }
        
        const data = await response.json();
        setContactInfo(data);
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
        setSaveStatus({ 
          type: 'error', 
          message: 'Failed to load contact information. Please check if the server is running.' 
        });
        
        // Set default values when API fails
        setContactInfo({
          address: 'Address not available',
          phone: 'Phone not available',
          email: 'Email not available'
        });
      }
    };
    
    fetchContactInfo();
  }, []);

  // Update handleSave function
  const handleSave = async (field) => {
    if (!tempValue.trim()) {
      setSaveStatus({ type: 'error', message: 'Field cannot be empty' });
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    try {
      const updatedInfo = { ...contactInfo, [field]: tempValue };
      
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedInfo)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        await response.json(); // Parse response if needed
      }

      setContactInfo(updatedInfo);
      setEditingField(null);
      setSaveStatus({ type: 'success', message: `${field} updated successfully` });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus({ 
        type: 'error', 
        message: error.message || 'Failed to update. Please check if the server is running.' 
      });
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information Admin</h1>
                <p className="text-gray-600 dark:text-gray-300">Manage your church's contact details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            saveStatus.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {saveStatus.type === 'success' ? (
              <Check className="h-5 w-5 mr-2" />
            ) : (
              <X className="h-5 w-5 mr-2" />
            )}
            {saveStatus.message}
          </div>
        )}

        {/* Contact Fields */}
        <div className="space-y-6">
          <ContactField
            field="address"
            icon={MapPin}
            label="Address"
            value={contactInfo.address}
            editingField={editingField}
            tempValue={tempValue}
            setTempValue={setTempValue}
            handleEdit={handleEdit}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
          
          <ContactField
            field="phone"
            icon={Phone}
            label="Phone"
            value={contactInfo.phone}
            editingField={editingField}
            tempValue={tempValue}
            setTempValue={setTempValue}
            handleEdit={handleEdit}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
          
          <ContactField
            field="email"
            icon={Mail}
            label="Email"
            value={contactInfo.email}
            editingField={editingField}
            tempValue={tempValue}
            setTempValue={setTempValue}
            handleEdit={handleEdit}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
        </div>

        {/* Preview Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Preview</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How it appears to visitors:</h3>
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
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;