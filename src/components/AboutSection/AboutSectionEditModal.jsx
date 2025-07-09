import React, { useState, useEffect } from 'react';
import { X, Save, Upload } from 'lucide-react';

const AboutSectionEditModal = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState({
    mainDescription: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isOpen && data) {
      setFormData({
        mainDescription: data.mainDescription || '',
        image: data.image || ''
      });
      setImagePreview(data.image || '');
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

const handleSave = () => {
  // Only send the fields we're actually using
  onSave({
    mainDescription: formData.mainDescription,
    image: formData.image
  });
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit About Section</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Text Content */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">About Text</h3>
            <textarea
              value={formData.mainDescription}
              onChange={(e) => handleInputChange('mainDescription', e.target.value)}
              rows="6"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your parish description"
            />
          </div>

          {/* Image Content */}
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
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutSectionEditModal;