import React, { useState, useEffect } from 'react';
import { Edit2, Type, Copy, Plus } from 'lucide-react';

const CategoriesAdmin = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [heroContent, setHeroContent] = useState({
    title: '',
    titleHighlight: '',
    paragraph1: '',
    paragraph2: '',
    paragraph3: '',
    paragraph4: '',
    buttonText: '',
  });
  const [newCategory, setNewCategory] = useState({
    title: '',
    imageFile: null,
    imagePreview: null,
    bankName: '',
    accountNumber: '',
    accountName: '',
    theme: 'brown',
    status: 'Active'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch donation categories
        const categoriesResponse = await fetch('http://localhost:5001/api/donations-sections/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch donation categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch hero content
        const heroResponse = await fetch('http://localhost:5001/api/donations-sections/hero');
        if (!heroResponse.ok) throw new Error('Failed to fetch hero content');
        const heroData = await heroResponse.json();
        setHeroContent(heroData);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleEditHero = () => {
    setShowHeroModal(true);
  };

  const handleAddCategory = () => {
    setShowAddModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleSaveChanges = async () => {
    if (!selectedCategory) return;

    try {
      const response = await fetch(`http://localhost:5001/api/donations-sections/categories/${selectedCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(selectedCategory),
      });

      if (!response.ok) throw new Error('Failed to update category');

      const updatedCategory = await response.json();
      setCategories(categories.map((cat) => (cat._id === updatedCategory._id ? updatedCategory : cat)));
      alert('Bank details updated successfully!');
      setShowEditModal(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error('Error updating category:', err);
      alert('Failed to update bank details.');
    }
  };

  const handleSaveNewCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newCategory.title);
      formData.append('bankName', newCategory.bankName);
      formData.append('accountNumber', newCategory.accountNumber);
      formData.append('accountName', newCategory.accountName);
      formData.append('theme', newCategory.theme);
      formData.append('status', newCategory.status);
      
      if (newCategory.imageFile) {
        formData.append('image', newCategory.imageFile);
      } else {
        alert('Please select an image');
        return;
      }

      const response = await fetch('http://localhost:5001/api/donations-sections/categories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add category');

      const addedCategory = await response.json();
      setCategories([...categories, addedCategory]);
      alert('Category added successfully!');
      setShowAddModal(false);
      setNewCategory({
        title: '',
        imageFile: null,
        imagePreview: null,
        bankName: '',
        accountNumber: '',
        accountName: '',
        theme: 'brown',
        status: 'Active'
      });
    } catch (err) {
      console.error('Error adding category:', err);
      alert('Failed to add category. Make sure to upload an image.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setNewCategory({
        ...newCategory,
        imageFile: file,
        imagePreview: previewUrl
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg text-red-600 mb-2">Error Loading Data</p>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </div>
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Content Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Hero Section Content</h2>
              <button
                onClick={handleEditHero}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Type className="h-4 w-4 mr-2" />
                Edit Hero Content
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {heroContent.title} <span className="text-yellow-600">{heroContent.titleHighlight}</span>
                  </h3>
                </div>
                <div className="text-gray-700 space-y-2">
                  <p>{heroContent.paragraph1}</p>
                  <p>{heroContent.paragraph2}</p>
                  <p>{heroContent.paragraph3}</p>
                  <p>{heroContent.paragraph4}</p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-full text-sm">
                    {heroContent.buttonText}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  You can edit the hero section content and bank details for existing categories. The category structure cannot be modified.
                </p>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Donation Categories</h2>
              <button
                onClick={handleAddCategory}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div 
                  key={category._id} 
                  className={`bg-white rounded-lg shadow-sm border overflow-hidden ${
                    category.theme === 'brown' 
                      ? 'border-amber-200' 
                      : category.theme === 'harvest'
                      ? 'border-orange-200'
                      : 'border-blue-200'
                  }`}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={`http://localhost:5001${category.image}`} 
                      alt={category.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 
                        className={`text-lg font-semibold ${
                          category.theme === 'brown' 
                            ? 'text-amber-800' 
                            : category.theme === 'harvest'
                            ? 'text-orange-700'
                            : 'text-blue-700'
                        }`}
                      >
                        {category.title}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {category.status}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-gray-600 font-medium mb-2">Account Details</p>
                        <p className="text-gray-800 font-semibold text-lg">{category.accountName}</p>
                      </div>

                      <div
                        className={`rounded-lg p-4 space-y-3 ${
                          category.theme === 'brown'
                            ? 'bg-amber-50 border border-amber-200'
                            : category.theme === 'harvest'
                            ? 'bg-orange-50 border border-orange-200'
                            : 'bg-blue-50 border border-blue-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Bank:</span>
                          <span className="font-semibold text-gray-800">{category.bankName}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Account Number:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-semibold text-gray-800">{category.accountNumber}</span>
                            <button
                              onClick={() => copyToClipboard(category.accountNumber)}
                              className={`p-1 text-gray-500 transition-colors ${
                                category.theme === 'brown'
                                  ? 'hover:text-amber-700'
                                  : category.theme === 'harvest'
                                  ? 'hover:text-orange-700'
                                  : 'hover:text-blue-700'
                              }`}
                              title="Copy to clipboard"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEditCategory(category)}
                        className={`w-full font-semibold py-2 px-4 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg ${
                          category.theme === 'brown'
                            ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800'
                            : category.theme === 'harvest'
                            ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                        }`}
                      >
                        Edit Bank Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Bank Details - {selectedCategory.title}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={selectedCategory.bankName}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, bankName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={selectedCategory.accountNumber}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, accountNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <input
                  type="text"
                  value={selectedCategory.accountName}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, accountName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedCategory.status}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Donation Category</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newCategory.title}
                  onChange={(e) => setNewCategory({...newCategory, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Tithes & Donation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  accept="image/*"
                />
                {newCategory.imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={newCategory.imagePreview} 
                      alt="Preview" 
                      className="h-32 w-full object-cover rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Image Preview</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={newCategory.bankName}
                  onChange={(e) => setNewCategory({...newCategory, bankName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Fidelity Bank"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={newCategory.accountNumber}
                  onChange={(e) => setNewCategory({...newCategory, accountNumber: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <input
                  type="text"
                  value={newCategory.accountName}
                  onChange={(e) => setNewCategory({...newCategory, accountName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Holy Family Catholic Church"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select
                  value={newCategory.theme}
                  onChange={(e) => setNewCategory({...newCategory, theme: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="brown">Brown</option>
                  <option value="harvest">Harvest</option>
                  <option value="building">Building</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newCategory.status}
                  onChange={(e) => setNewCategory({...newCategory, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hero Content Modal */}
      {showHeroModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Hero Section Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
                <input
                  type="text"
                  value={heroContent.title}
                  onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Your Donations Keep The"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highlighted Title</label>
                <input
                  type="text"
                  value={heroContent.titleHighlight}
                  onChange={(e) => setHeroContent({ ...heroContent, titleHighlight: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Candles Lit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 1</label>
                <textarea
                  value={heroContent.paragraph1}
                  onChange={(e) => setHeroContent({ ...heroContent, paragraph1: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 2</label>
                <textarea
                  value={heroContent.paragraph2}
                  onChange={(e) => setHeroContent({ ...heroContent, paragraph2: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 3</label>
                <textarea
                  value={heroContent.paragraph3}
                  onChange={(e) => setHeroContent({ ...heroContent, paragraph3: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 4</label>
                <textarea
                  value={heroContent.paragraph4}
                  onChange={(e) => setHeroContent({ ...heroContent, paragraph4: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={heroContent.buttonText}
                  onChange={(e) => setHeroContent({ ...heroContent, buttonText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., DONATE TO A CAUSE BELOW"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowHeroModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHeroChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesAdmin;