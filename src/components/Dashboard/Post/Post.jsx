import React, { useState, useEffect } from 'react';
import { Save, Upload, X, Eye, Edit, Trash2, Plus, ArrowLeft, Menu } from 'lucide-react';

const DonationAdmin = () => {
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    header: "",
    paragraph: "",
    images: []
  });
  const [mode, setMode] = useState('list'); // 'list', 'edit', 'create'
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all donation sections from backend
  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://distinct-stranger-production.up.railway.app/api/donation-sections');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
        }
        
        const data = await response.json();
        setSections(data);
      } catch (error) {
        console.error('Error fetching donation data:', error);
        setError('Failed to load donation data: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDonationData();
  }, []);

  // Load a section for editing
  const loadSectionForEditing = (section) => {
    setFormData({
      id: section._id,
      header: section.header,
      paragraph: section.paragraph,
      images: section.images.map(img => ({
        ...img,
        id: img._id
      }))
    });
    setMode('edit');
  };

  // Create new section
  const createNewSection = () => {
    setFormData({
      header: "",
      paragraph: "",
      images: []
    });
    setMode('create');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: `temp-${Date.now()}-${Math.random()}`,
          url: event.target.result,
          alt: file.name.split('.')[0],
          isActive: formData.images.length === 0,
          isNew: true
        };
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, newImage]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const setActiveImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isActive: img.id === imageId
      }))
    }));
  };

  const removeImage = (imageId) => {
    setFormData(prev => {
      const updatedImages = prev.images.filter(img => img.id !== imageId);
      if (updatedImages.length > 0 && !updatedImages.some(img => img.isActive)) {
        updatedImages[0].isActive = true;
      }
      return {
        ...prev,
        images: updatedImages
      };
    });
  };

  const updateImageAlt = (imageId, newAlt) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === imageId ? { ...img, alt: newAlt } : img
      )
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to perform this action');
      }

      const method = mode === 'create' ? 'POST' : 'PUT';
      const endpoint = mode === 'create' 
        ? 'https://distinct-stranger-production.up.railway.app/api/donation-sections'
        : `https://distinct-stranger-production.up.railway.app/api/donation-sections/${formData.id}`;
      
      const payload = {
        header: formData.header,
        paragraph: formData.paragraph,
        images: formData.images.map(img => ({
          url: img.url,
          alt: img.alt,
          isActive: img.isActive
        }))
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save donation section');
      }

      const result = await response.json();
      console.log('Save successful:', result);
      
      if (mode === 'create') {
        setSections(prev => [result, ...prev]);
      } else {
        setSections(prev => prev.map(section => 
          section._id === result._id ? result : section
        ));
      }
      
      setMode('list');
      alert('Donation section saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      
      if (error.message.includes('must be logged in') || 
          error.message.includes('Session expired')) {
        alert(error.message);
        window.location.href = '/login';
      } else {
        alert('Failed to save donation section: ' + error.message);
      }
    }
  };

  const deleteSection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation section?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://distinct-stranger-production.up.railway.app/api/donation-sections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete donation section');
      }

      setSections(prev => prev.filter(section => section._id !== id));
      alert('Donation section deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete donation section: ' + error.message);
    }
  };

  const activeImage = formData.images.find(img => img.isActive);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading donation data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm border-b px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Preview Mode</h1>
            <button
              onClick={() => setPreviewMode(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center gap-2 text-sm sm:text-base transition-colors"
            >
              <Edit size={16} />
              <span className="hidden sm:inline">Back to Edit</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
        </div>
        
        {/* Preview of the actual donation section */}
        <section className="py-8 sm:py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 relative">
                  {activeImage ? (
                    <img 
                      src={activeImage.url} 
                      alt={activeImage.alt}
                      className="w-full h-64 sm:h-80 lg:h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 sm:h-80 flex items-center justify-center">
                      <span className="text-gray-500">No image selected</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-md font-semibold transition-colors duration-200 shadow-lg text-sm sm:text-base">
                      DONATE NOW
                    </button>
                  </div>
                </div>
                
                <div className="lg:w-1/2 bg-white p-6 sm:p-8 lg:p-12">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                    {formData.header || "Donation Section Header"}
                  </h2>
                  
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    {formData.paragraph || "Enter your donation description here..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // List view - shows all donation sections
  if (mode === 'list') {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm border-b px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Donation Sections</h1>
            <button
              onClick={createNewSection}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <Plus size={16} />
              Create New
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {sections.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">No Donation Sections Found</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                You haven't created any donation sections yet. Create your first one to get started.
              </p>
              <button
                onClick={createNewSection}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus size={18} />
                Create First Section
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Header
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Images
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sections.map((section) => {
                      const activeImage = section.images.find(img => img.isActive) || section.images[0];
                      return (
                        <tr key={section._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{section.header}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(section.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {activeImage && (
                                <img 
                                  src={activeImage.url} 
                                  alt={activeImage.alt} 
                                  className="w-10 h-10 rounded-md object-cover mr-2"
                                />
                              )}
                              <span className="text-sm text-gray-500">
                                {section.images.length} image(s)
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => loadSectionForEditing(section)}
                                className="text-blue-600 hover:text-blue-900 flex items-center transition-colors"
                              >
                                <Edit size={16} className="mr-1" /> Edit
                              </button>
                              <button
                                onClick={() => deleteSection(section._id)}
                                className="text-red-600 hover:text-red-900 flex items-center transition-colors"
                              >
                                <Trash2 size={16} className="mr-1" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {sections.map((section) => {
                  const activeImage = section.images.find(img => img.isActive) || section.images[0];
                  return (
                    <div key={section._id} className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {activeImage ? (
                            <img 
                              src={activeImage.url} 
                              alt={activeImage.alt} 
                              className="w-16 h-16 rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-xs text-gray-500">No img</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{section.header}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Created: {new Date(section.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {section.images.length} image(s)
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0 flex flex-col space-y-2">
                          <button
                            onClick={() => loadSectionForEditing(section)}
                            className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteSection(section._id)}
                            className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Edit/Create view
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center">
            <button
              onClick={() => setMode('list')}
              className="text-gray-600 hover:text-gray-900 mr-3 sm:mr-4 flex items-center transition-colors"
            >
              <ArrowLeft size={20} className="mr-1" /> 
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
              {mode === 'edit' ? "Edit Donation Section" : "Create Donation Section"}
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setPreviewMode(true)}
              disabled={formData.images.length === 0}
              className={`px-3 sm:px-4 py-2 rounded-md flex items-center gap-2 text-sm sm:text-base transition-colors ${
                formData.images.length === 0
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Eye size={16} />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.header || !formData.paragraph || formData.images.length === 0}
              className={`px-3 sm:px-4 py-2 rounded-md flex items-center gap-2 text-sm sm:text-base transition-colors ${
                !formData.header || !formData.paragraph || formData.images.length === 0
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <Save size={16} />
              <span className="hidden sm:inline">{mode === 'edit' ? "Update" : "Create"}</span>
              <span className="sm:hidden">Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Section Header</h2>
              <input
                type="text"
                value={formData.header}
                onChange={(e) => handleInputChange('header', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter section header"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                This will be the main headline for your donation section
              </p>
            </div>

            {/* Paragraph Section */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Content Paragraph</h2>
              <textarea
                value={formData.paragraph}
                onChange={(e) => handleInputChange('paragraph', e.target.value)}
                rows={6}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                placeholder="Enter section paragraph"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Describe your donation cause and how contributions will be used
              </p>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Section Images</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">Click to upload images</p>
                  <p className="text-xs sm:text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                </label>
              </div>
              
              <div className="mt-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  <span className="font-semibold">Tip:</span> The first image you upload will be 
                  set as active by default. You can change the active image by clicking 
                  "Set Active" on any image.
                </p>
              </div>
            </div>

            {/* Image Gallery */}
            {formData.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                  Uploaded Images ({formData.images.length})
                </h3>
                <div className="space-y-4">
                  {formData.images.map((image) => (
                    <div
                      key={image.id}
                      className={`border-2 rounded-lg p-3 sm:p-4 transition-all ${
                        image.isActive 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                          />
                          {image.isActive && (
                            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 rounded-bl-md">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex-1 space-y-2 min-w-0">
                          <input
                            type="text"
                            value={image.alt}
                            onChange={(e) => updateImageAlt(image.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Image description"
                          />
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => setActiveImage(image.id)}
                              className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center gap-1 transition-colors ${
                                image.isActive
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {image.isActive ? (
                                <>
                                  <Eye size={14} /> Active
                                </>
                              ) : (
                                "Set Active"
                              )}
                            </button>
                            <button
                              onClick={() => removeImage(image.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs sm:text-sm font-medium hover:bg-red-200 flex items-center justify-center gap-1 transition-colors"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Empty state for images */}
        {formData.images.length === 0 && (
          <div className="mt-6 sm:mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center">
            <h3 className="text-base sm:text-lg font-medium text-yellow-800">No Images Uploaded</h3>
            <p className="text-yellow-700 mt-2 text-sm sm:text-base">
              You need to upload at least one image to create the donation section.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationAdmin;