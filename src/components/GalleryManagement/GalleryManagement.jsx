import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit3, Trash2, Save, X, Upload, Eye, Move, ArrowUp, ArrowDown } from 'lucide-react';

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [newImage, setNewImage] = useState({
    title: '',
    description: '',
    category: 'general',
    file: null,
    previewUrl: null
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const categories = [
    'general',
    'masses',
    'events',
    'ministries',
    'community',
    'celebrations',
    'facilities'
  ];

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // Helper to get full image URL
  const getFullImageUrl = (url) => {
    if (!url) return '';
    
    // If it's a blob URL (preview) or base64 data URL, return as-is
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    
    // For server images, use as-is (server returns full URLs)
    return url;
  };

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('https://distinct-stranger-production.up.railway.app/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch gallery images');
      const data = await response.json();
      setImages(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(prev => ({
        ...prev,
        file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleEditFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditingImage(prev => ({
        ...prev,
        file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('https://distinct-stranger-production.up.railway.app/api/gallery/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleAddImage = async () => {
    if (!newImage.file) {
      setError('Please select an image file');
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload image
      const imageUrl = await uploadImage(newImage.file);
      
      // Create gallery item
      const response = await fetch('https://distinct-stranger-production.up.railway.app/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: imageUrl,
          title: newImage.title,
          description: newImage.description,
          category: newImage.category,
          isActive: true
        })
      });
      
      if (!response.ok) throw new Error('Failed to add image');
      
      const addedImage = await response.json();
      setImages(prev => [...prev, addedImage]);
      
      // Reset form
      setNewImage({
        title: '',
        description: '',
        category: 'general',
        file: null,
        previewUrl: null
      });
      setIsAddingImage(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingImage) return;
    
    try {
      setUploading(true);
      let imageUrl = editingImage.url;
      
      // If a new file was selected, upload it
      if (editingImage.file) {
        imageUrl = await uploadImage(editingImage.file);
      }
      
      // Update gallery item
      const response = await fetch(`'https://distinct-stranger-production.up.railway.app/api/gallery/${editingImage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingImage,
          url: imageUrl
        })
      });
      
      if (!response.ok) throw new Error('Failed to update image');
      
      const updatedImage = await response.json();
      setImages(prev => prev.map(img => 
        img.id === updatedImage.id ? updatedImage : img
      ));
      
      setEditingImage(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await fetch(`'https://distinct-stranger-production.up.railway.app/api/gallery/${imageId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete image');
        
        setImages(prev => prev.filter(img => img.id !== imageId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const toggleImageStatus = async (imageId) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;
    
    const updatedStatus = !image.isActive;
    
    try {
      const response = await fetch(`'https://distinct-stranger-production.up.railway.app/api/gallery/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...image, isActive: updatedStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update image status');
      
      const updatedImage = await response.json();
      setImages(prev => prev.map(img => 
        img.id === updatedImage.id ? updatedImage : img
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const moveImage = (imageId, direction) => {
    const currentIndex = images.findIndex(img => img.id === imageId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === images.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedImages = [...images];
    [updatedImages[currentIndex], updatedImages[newIndex]] = 
    [updatedImages[newIndex], updatedImages[currentIndex]];
    
    setImages(updatedImages);
  };

  const handleImageError = (e) => {
    console.error('Failed to load image:', e.target.src);
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg text-red-600 mb-2">Error Loading Gallery</p>
        <p className="text-gray-700 mb-4">{error}</p>
        <button 
          onClick={fetchGalleryImages}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
          <p className="text-gray-600 mt-1">Manage church photo gallery images</p>
        </div>
        <button
          onClick={() => setIsAddingImage(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Image
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{images.length}</div>
          <div className="text-sm text-gray-600">Total Images</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {images.filter(img => img.isActive).length}
          </div>
          <div className="text-sm text-gray-600">Active Images</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">
            {images.filter(img => !img.isActive).length}
          </div>
          <div className="text-sm text-gray-600">Hidden Images</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(images.map(img => img.category)).size}
          </div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
      </div>

      {/* Add Image Form */}
      {isAddingImage && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add New Image</h3>
            <button
              onClick={() => setIsAddingImage(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image *
              </label>
              <div className="flex items-center justify-center w-full">
                <label 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
            
            {newImage.previewUrl && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <img
                  src={getFullImageUrl(newImage.previewUrl)}
                  alt="Preview"
                  className="w-32 h-32 object-contain rounded border"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newImage.title}
                onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Image title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newImage.category}
                onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newImage.description}
                onChange={(e) => setNewImage(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description"
                rows="2"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setIsAddingImage(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddImage}
              disabled={!newImage.file || uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Add Image'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Images Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Gallery Images</h3>
        </div>
        
        {images.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No images in gallery</p>
            <p className="text-sm text-gray-400">Add your first image to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {images.map((image, index) => (
              <div key={image.id} className="border rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={getFullImageUrl(image.url)}
                    alt={image.title || `Gallery image ${index + 1}`}
                    className="w-full h-48 object-cover"
                    onError={handleImageError}
                  />
                  {!image.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Hidden</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {image.title || 'Untitled'}
                      </h4>
                      <p className="text-sm text-gray-500 capitalize">{image.category}</p>
                      {image.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {image.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => moveImage(image.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveImage(image.id, 'down')}
                        disabled={index === images.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleImageStatus(image.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          image.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {image.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setPreviewImage(image)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingImage({ ...image, file: null, previewUrl: null })}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Image</h3>
                <button
                  onClick={() => setEditingImage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label 
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      onClick={() => editFileInputRef.current.click()}
                    >
                      <div className="flex flex-col items-center justify-center pt-3 pb-4">
                        <Upload className="w-6 h-6 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Click to change image</p>
                      </div>
                      <input 
                        ref={editFileInputRef}
                        type="file" 
                        className="hidden" 
                        onChange={handleEditFileChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
                
                {(editingImage.previewUrl || editingImage.url) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <img
                      src={editingImage.previewUrl || getFullImageUrl(editingImage.url)}
                      alt="Preview"
                      className="w-full h-32 object-contain rounded border"
                      onError={handleImageError}
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingImage.title}
                    onChange={(e) => setEditingImage(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={editingImage.category}
                    onChange={(e) => setEditingImage(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingImage.description}
                    onChange={(e) => setEditingImage(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              {error && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Image Preview</h3>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <img
                src={getFullImageUrl(previewImage.url)}
                alt={previewImage.title}
                className="w-full max-h-96 object-contain rounded"
                onError={handleImageError}
              />
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-900">{previewImage.title}</h4>
                <p className="text-sm text-gray-500 capitalize">{previewImage.category}</p>
                {previewImage.description && (
                  <p className="text-sm text-gray-600 mt-2">{previewImage.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;