import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, Upload, Eye, Move, ArrowUp, ArrowDown } from 'lucide-react';

const GalleryManagement = ({ data, setData }) => {
  const [images, setImages] = useState(data?.gallery || []);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [newImage, setNewImage] = useState({
    url: '',
    title: '',
    description: '',
    category: 'general'
  });

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
    setImages(data?.gallery || []);
  }, [data]);

  const handleAddImage = () => {
    if (newImage.url.trim()) {
      const imageWithId = {
        ...newImage,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString().split('T')[0],
        isActive: true
      };
      
      const updatedImages = [...images, imageWithId];
      setImages(updatedImages);
      
      // Update parent data
      setData(prev => ({
        ...prev,
        gallery: updatedImages
      }));
      
      // Reset form
      setNewImage({
        url: '',
        title: '',
        description: '',
        category: 'general'
      });
      setIsAddingImage(false);
    }
  };

  const handleEditImage = (image) => {
    setEditingImage({ ...image });
  };

  const handleSaveEdit = () => {
    const updatedImages = images.map(img => 
      img.id === editingImage.id ? editingImage : img
    );
    setImages(updatedImages);
    
    setData(prev => ({
      ...prev,
      gallery: updatedImages
    }));
    
    setEditingImage(null);
  };

  const handleDeleteImage = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      const updatedImages = images.filter(img => img.id !== imageId);
      setImages(updatedImages);
      
      setData(prev => ({
        ...prev,
        gallery: updatedImages
      }));
    }
  };

  const toggleImageStatus = (imageId) => {
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, isActive: !img.isActive } : img
    );
    setImages(updatedImages);
    
    setData(prev => ({
      ...prev,
      gallery: updatedImages
    }));
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
    setData(prev => ({
      ...prev,
      gallery: updatedImages
    }));
  };

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
  };

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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                value={newImage.url}
                onChange={(e) => setNewImage(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={newImage.description}
                onChange={(e) => setNewImage(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description"
              />
            </div>
            
            {newImage.url && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <img
                  src={newImage.url}
                  alt="Preview"
                  className="w-32 h-24 object-cover rounded border"
                  onError={handleImageError}
                />
              </div>
            )}
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
              disabled={!newImage.url.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Image
            </button>
          </div>
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
                    src={image.url}
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
                        onClick={() => handleEditImage(image)}
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
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editingImage.url}
                    onChange={(e) => setEditingImage(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
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
                
                {editingImage.url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <img
                      src={editingImage.url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded border"
                      onError={handleImageError}
                    />
                  </div>
                )}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
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
                src={previewImage.url}
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