import React, { useState, useRef } from 'react';
import { Save, X, Upload } from 'lucide-react';

const SlideEditor = ({ slide, onSave, onCancel }) => {
  const [editedSlide, setEditedSlide] = useState(slide);
  const [imagePreview, setImagePreview] = useState(slide.image || '');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditedSlide(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditedSlide(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCtaChange = (type, field, value) => {
    setEditedSlide(prev => ({
      ...prev,
      cta: {
        ...prev.cta,
        [type]: {
          ...prev.cta[type],
          [field]: value
        }
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle image preview source
  const getImagePreviewSrc = () => {
    if (!imagePreview) return '';
    if (imagePreview.startsWith('data:') || imagePreview.startsWith('http')) {
      return imagePreview;
    }
    return `${backendUrl}${imagePreview}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Edit Slide</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onSave(editedSlide, imageFile)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={editedSlide.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={editedSlide.subtitle}
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={editedSlide.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slide Image
          </label>
          
          <div className="flex items-center space-x-4">
            {imagePreview && (
              <div className="w-32 h-20 border rounded-md overflow-hidden">
                <img 
                  src={getImagePreviewSrc()} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                <Upload size={16} />
                {imageFile ? "Change Image" : "Upload Image"}
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Recommended size: 1920x1080px
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button</label>
            <input
              type="text"
              placeholder="Button Text"
              value={editedSlide.cta.primary.text}
              onChange={(e) => handleCtaChange('primary', 'text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2"
            />
            <input
              type="text"
              placeholder="Button Link"
              value={editedSlide.cta.primary.link}
              onChange={(e) => handleCtaChange('primary', 'link', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button</label>
            <input
              type="text"
              placeholder="Button Text"
              value={editedSlide.cta.secondary.text}
              onChange={(e) => handleCtaChange('secondary', 'text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2"
            />
            <input
              type="text"
              placeholder="Button Link"
              value={editedSlide.cta.secondary.link}
              onChange={(e) => handleCtaChange('secondary', 'link', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideEditor;