// components/AboutSection/AboutSectionEditModal.js
import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

const AboutSectionEditModal = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState({
    parishName: '',
    established: '',
    yearsOfService: '',
    mission: '',
    image: '',
    mainDescription: '',
    additionalDescription: '',
    statistics: [],
    buttonText: '',
    buttonLink: ''
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isOpen && data?.aboutSection) {
      setFormData({
        parishName: data.aboutSection.parishName || 'St. Mary\'s Parish',
        established: data.aboutSection.established || '1948',
        yearsOfService: data.aboutSection.yearsOfService || '75+ years',
        mission: data.aboutSection.mission || 'Our mission is to be a welcoming community where all people can encounter Jesus Christ, grow in faith, and serve others with love and compassion.',
        image: data.aboutSection.image || '',
        mainDescription: data.aboutSection.mainDescription || 'St. Mary\'s Parish has been serving our community for over 75 years. We are a vibrant Catholic community committed to spreading the Gospel through worship, service, and fellowship.',
        additionalDescription: data.aboutSection.additionalDescription || '',
        statistics: data.aboutSection.statistics || [],
        buttonText: data.aboutSection.buttonText || 'Learn More About Us',
        buttonLink: data.aboutSection.buttonLink || '/about'
      });
      setImagePreview(data.aboutSection.image || '');
    }
  }, [isOpen, data]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        handleInputChange('image', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const addStatistic = () => {
    const newStat = { value: '', label: '' };
    setFormData(prev => ({
      ...prev,
      statistics: [...prev.statistics, newStat]
    }));
  };

  const updateStatistic = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      statistics: prev.statistics.map((stat, i) =>
        i === index ? { ...stat, [field]: value } : stat
      )
    }));
  };

  const removeStatistic = (index) => {
    setFormData(prev => ({
      ...prev,
      statistics: prev.statistics.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    const updatedData = {
      ...data,
      aboutSection: formData
    };
    onSave(updatedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit About Section</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-8">
          {/* Parish Information */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Parish Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parish Name
                </label>
                <input
                  type="text"
                  value={formData.parishName}
                  onChange={(e) => handleInputChange('parishName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter parish name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Established Year
                </label>
                <input
                  type="text"
                  value={formData.established}
                  onChange={(e) => handleInputChange('established', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 1948"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Service
                </label>
                <input
                  type="text"
                  value={formData.yearsOfService}
                  onChange={(e) => handleInputChange('yearsOfService', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 75+ years"
                />
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mission Statement</h3>
            <textarea
              value={formData.mission}
              onChange={(e) => handleInputChange('mission', e.target.value)}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your parish mission statement"
            />
          </div>

          {/* Parish Image */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Parish Image</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-gray-600">
                  Or paste an image URL below
                </span>
              </div>
              
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter image URL"
              />

              {imagePreview && (
                <div className="relative w-full max-w-md">
                  <img
                    src={imagePreview}
                    alt="Parish preview"
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute top-2 right-2 bg-white bg-opacity-80 px-2 py-1 rounded text-xs text-gray-600">
                    Preview
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Parish Description */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Parish Description</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Description
                </label>
                <textarea
                  value={formData.mainDescription}
                  onChange={(e) => handleInputChange('mainDescription', e.target.value)}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter main parish description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  value={formData.additionalDescription}
                  onChange={(e) => handleInputChange('additionalDescription', e.target.value)}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter additional parish information"
                />
              </div>
            </div>
          </div>

          {/* Parish Statistics */}
          <div className="bg-amber-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Parish Statistics</h3>
              <button
                onClick={addStatistic}
                className="flex items-center gap-2 bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Statistic
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.statistics.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStatistic(index, 'value', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Value (e.g., 500+)"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStatistic(index, 'label', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Label (e.g., Members)"
                  />
                  <button
                    onClick={() => removeStatistic(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {formData.statistics.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No statistics added yet. Click "Add Statistic" to get started.
                </p>
              )}
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="bg-gradient-to-r from-red-50 to-blue-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Call to Action Button</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Learn More About Us"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Link
                </label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., /about"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <button className="bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors text-sm">
                {formData.buttonText || 'Button Text'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutSectionEditModal;