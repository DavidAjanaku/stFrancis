import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Phone, Mail, Edit3, Plus, Save, X, 
  ChevronDown, ChevronUp, ArrowLeft, Trash2, Eye, EyeOff, 
  Settings, Search, Filter, Download, Upload
} from 'lucide-react';

const ParishSocietiesAdminUI = () => {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [selectedSocieties, setSelectedSocieties] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewSociety, setPreviewSociety] = useState(null);

  const [newSociety, setNewSociety] = useState({
    name: "",
    howToJoin: "",
    meetingDate: "",
    meetingTime: "",
    coordinator: "",
    contacts: [
      { name: "", phone: "" },
      { name: "", phone: "" }
    ],
    isActive: true
  });

  // Enhanced API request function with detailed logging
  const apiRequest = async (url, method, body = null, requiresAuth = true) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorBody;
        try {
          errorBody = await response.json();
        } catch (jsonError) {
          errorBody = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.error('API Error Response:', {
          url,
          status: response.status,
          error: errorBody,
          body: config.body ? JSON.parse(config.body) : null
        });
        
        throw new Error(errorBody.message || 'Request failed');
      }
      
      return await response.json();
    } catch (err) {
      console.error('API Request Failed:', {
        url,
        method,
        error: err.message,
        body: config.body ? JSON.parse(config.body) : null
      });
      throw err;
    }
  };

  // Fetch societies on component mount
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await apiRequest('https://distinct-stranger-production.up.railway.app/api/parish-societies', 'GET', null, false);
        setSocieties(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to load societies data');
        setLoading(false);
        console.error('Error fetching societies:', err);
      }
    };

    fetchSocieties();
  }, []);

  // CRUD Operations
  const addSociety = async () => {
    try {
      const addedSociety = await apiRequest(
        'https://distinct-stranger-production.up.railway.app/api/parish-societies',
        'POST',
        newSociety
      );
      setSocieties([...societies, addedSociety]);
      setNewSociety({
        name: "",
        howToJoin: "",
        meetingDate: "",
        meetingTime: "",
        coordinator: "",
        contacts: [{ name: "", phone: "" }, { name: "", phone: "" }],
        isActive: true
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding society:', err);
      alert('Failed to add society: ' + err.message);
    }
  };

  const updateSociety = async (id, updatedData) => {
    try {
      const updatedSociety = await apiRequest(
        `'https://distinct-stranger-production.up.railway.app/api/parish-societies/${id}`,
        'PUT',
        updatedData
      );
      setSocieties(societies.map(society => 
        society._id === id ? updatedSociety : society
      ));
      setEditingId(null);
    } catch (err) {
      console.error('Error updating society:', err);
      alert('Failed to update society: ' + err.message);
    }
  };

  const deleteSociety = async (id) => {
    if (window.confirm('Are you sure you want to delete this society? This action cannot be undone.')) {
      try {
        await apiRequest(
          `'https://distinct-stranger-production.up.railway.app/api/parish-societies/${id}`,
          'DELETE'
        );
        setSocieties(societies.filter(society => society._id !== id));
      } catch (err) {
        console.error('Error deleting society:', err);
        alert('Failed to delete society: ' + err.message);
      }
    }
  };

  const toggleSocietyStatus = async (id) => {
    try {
      const toggledSociety = await apiRequest(
        `'https://distinct-stranger-production.up.railway.app/api/parish-societies/${id}/toggle-status`,
        'PATCH',
        {}
      );
      setSocieties(societies.map(society => 
        society._id === id ? toggledSociety : society
      ));
    } catch (err) {
      console.error('Error toggling society status:', err);
      alert('Failed to toggle society status: ' + err.message);
    }
  };

  const bulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedSocieties.length} societies? This action cannot be undone.`)) {
      try {
        await apiRequest(
          'https://distinct-stranger-production.up.railway.app/api/parish-societies/bulk-delete',
          'POST',
          { ids: selectedSocieties }
        );
        setSocieties(societies.filter(society => !selectedSocieties.includes(society._id)));
        setSelectedSocieties([]);
      } catch (err) {
        console.error('Error in bulk delete:', err);
        alert('Failed to delete selected societies: ' + err.message);
      }
    }
  };

  const bulkToggleStatus = async (active) => {
    try {
      await apiRequest(
        'https://distinct-stranger-production.up.railway.app/api/parish-societies/bulk-update',
        'POST',
        {
          ids: selectedSocieties,
          updates: { isActive: active }
        }
      );
      setSocieties(societies.map(society => 
        selectedSocieties.includes(society._id) ? 
          { ...society, isActive: active } : society
      ));
      setSelectedSocieties([]);
    } catch (err) {
      console.error('Error in bulk update:', err);
      alert('Failed to update selected societies: ' + err.message);
    }
  };

  const duplicateSociety = async (society) => {
    try {
      const duplicatedSociety = {
        ...society,
        _id: undefined,
        name: `${society.name} (Copy)`,
        createdDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      delete duplicatedSociety._id;
      delete duplicatedSociety.__v;
      
      const addedSociety = await apiRequest(
        'https://distinct-stranger-production.up.railway.app/api/parish-societies',
        'POST',
        duplicatedSociety
      );
      setSocieties([...societies, addedSociety]);
    } catch (err) {
      console.error('Error duplicating society:', {
        error: err.message,
        society: duplicatedSociety
      });
      alert('Failed to duplicate society: ' + err.message);
    }
  };

  // Filter and search functionality
  const filteredSocieties = societies.filter(society => {
    const matchesSearch = society.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         society.coordinator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && society.isActive) ||
                         (filterActive === 'inactive' && !society.isActive);
    return matchesSearch && matchesFilter;
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedSocieties(filteredSocieties.map(s => s._id));
    } else {
      setSelectedSocieties([]);
    }
  };

  const handleSelectSociety = (id, checked) => {
    if (checked) {
      setSelectedSocieties([...selectedSocieties, id]);
    } else {
      setSelectedSocieties(selectedSocieties.filter(sid => sid !== id));
    }
  };

  const previewSocietyCard = (society) => {
    setPreviewSociety(society);
    setShowPreview(true);
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading parish societies...</p>
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
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
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
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parish Societies Management</h1>
              <p className="text-gray-600">Manage all parish societies and organizations</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(societies, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  const exportFileDefaultName = 'parish-societies.json';
                  
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Society</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search societies or coordinators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">All Societies</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedSocieties.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-amber-800 font-medium">
                  {selectedSocieties.length} societies selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => bulkToggleStatus(true)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Activate All
                  </button>
                  <button
                    onClick={() => bulkToggleStatus(false)}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Deactivate All
                  </button>
                  <button
                    onClick={bulkDelete}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Delete All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="text-amber-600" size={24} />
              <div className="ml-3">
                <p className="text-gray-600 text-sm">Total Societies</p>
                <p className="text-2xl font-semibold">{societies.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Eye className="text-green-600" size={24} />
              <div className="ml-3">
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-2xl font-semibold">{societies.filter(s => s.isActive).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <EyeOff className="text-red-600" size={24} />
              <div className="ml-3">
                <p className="text-gray-600 text-sm">Inactive</p>
                <p className="text-2xl font-semibold">{societies.filter(s => !s.isActive).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Calendar className="text-blue-600" size={24} />
              <div className="ml-3">
                <p className="text-gray-600 text-sm">This Month</p>
                <p className="text-2xl font-semibold">
                  {societies.filter(s => new Date(s.createdDate).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add New Society</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <SocietyForm 
                  society={newSociety}
                  setSociety={setNewSociety}
                  onSave={addSociety}
                  onCancel={() => setShowAddForm(false)}
                  isNew={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && previewSociety && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Society Preview</h2>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <SocietyPreview society={previewSociety} />
              </div>
            </div>
          </div>
        )}

        {/* Societies Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedSocieties.length === filteredSocieties.length && filteredSocieties.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="mr-3 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <h3 className="text-lg font-medium">Societies List ({filteredSocieties.length})</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedSocieties.length === filteredSocieties.length && filteredSocieties.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Society Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coordinator
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meeting Schedule
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSocieties.map((society) => (
                  <SocietyRow
                    key={society._id}
                    society={society}
                    isSelected={selectedSocieties.includes(society._id)}
                    onSelect={handleSelectSociety}
                    onEdit={() => setEditingId(society._id)}
                    onDelete={() => deleteSociety(society._id)}
                    onToggleStatus={() => toggleSocietyStatus(society._id)}
                    onDuplicate={() => duplicateSociety(society)}
                    onPreview={() => previewSocietyCard(society)}
                    isEditing={editingId === society._id}
                    onSave={updateSociety}
                    onCancelEdit={() => setEditingId(null)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredSocieties.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No societies found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Society Row Component
const SocietyRow = ({ 
  society, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onDuplicate, 
  onPreview,
  isEditing,
  onSave,
  onCancelEdit
}) => {
  if (isEditing) {
    return (
      <tr className="bg-amber-50">
        <td colSpan="6" className="px-4 py-6">
          <SocietyEditForm
            society={society}
            onSave={onSave}
            onCancel={onCancelEdit}
          />
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(society._id, e.target.checked)}
          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
        />
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{society.name}</div>
        <div className="text-sm text-gray-500">Created: {new Date(society.createdDate).toLocaleDateString()}</div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{society.coordinator}</div>
        <div className="text-sm text-gray-500">{society.contacts[0]?.phone}</div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{society.meetingDate}</div>
        <div className="text-sm text-gray-500">{society.meetingTime}</div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          society.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {society.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={onPreview}
            className="text-blue-600 hover:text-blue-900"
            title="Preview"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-900"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={onToggleStatus}
            className={`${society.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
            title={society.isActive ? 'Deactivate' : 'Activate'}
          >
            {society.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={() => onDuplicate(society)}
            className="text-yellow-600 hover:text-yellow-900"
            title="Duplicate"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-900"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Society Form Component (for Add/Edit)
const SocietyForm = ({ society, setSociety, onSave, onCancel, isNew = false }) => {
// In your SocietyForm component
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Enhanced validation with proper length checks
  const validationErrors = [];
  
  if (!society.name || society.name.length < 3) {
    validationErrors.push('Society name must be at least 3 characters');
  }
  
  if (!society.howToJoin || society.howToJoin.length < 10) {
    validationErrors.push('How to join information must be at least 10 characters');
  }
  
  if (!society.meetingDate || society.meetingDate.length < 3) {
    validationErrors.push('Meeting date must be at least 3 characters');
  }
  
  if (!society.meetingTime || society.meetingTime.length < 3) {
    validationErrors.push('Meeting time must be at least 3 characters');
  }
  
  if (!society.coordinator || society.coordinator.length < 3) {
    validationErrors.push('Coordinator name must be at least 3 characters');
  }
  
  // Validate contacts
  society.contacts.forEach((contact, index) => {
    if (!contact.name || contact.name.length < 2) {
      validationErrors.push(`Contact ${index + 1} name must be at least 2 characters`);
    }
    if (!contact.phone || contact.phone.length < 6) {
      validationErrors.push(`Contact ${index + 1} phone must be at least 6 characters`);
    }
  });
  
  if (validationErrors.length > 0) {
    alert(`Please fix the following errors:\n${validationErrors.join('\n')}`);
    return;
  }
  
  onSave();
};

  const addContact = () => {
    setSociety({
      ...society,
      contacts: [...society.contacts, { name: "", phone: "" }]
    });
  };

  const removeContact = (index) => {
    if (society.contacts.length > 2) {
      setSociety({
        ...society,
        contacts: society.contacts.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Society Name *</label>
          <input
            type="text"
            value={society.name}
            onChange={(e) => setSociety({...society, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coordinator *</label>
          <input
            type="text"
            value={society.coordinator}
            onChange={(e) => setSociety({...society, coordinator: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Date *</label>
          <input
            type="text"
            value={society.meetingDate}
            onChange={(e) => setSociety({...society, meetingDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="e.g., Every Sunday"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time *</label>
          <input
            type="text"
            value={society.meetingTime}
            onChange={(e) => setSociety({...society, meetingTime: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="e.g., 4:00 PM - 6:00 PM"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">How to Join *</label>
        <textarea
          value={society.howToJoin}
          onChange={(e) => setSociety({...society, howToJoin: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          rows="3"
          placeholder="Describe how interested members can join this society"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Contact Persons</label>
          <button
            type="button"
            onClick={addContact}
            className="text-amber-600 hover:text-amber-700 text-sm flex items-center"
          >
            <Plus size={14} className="mr-1" />
            Add Contact
          </button>
        </div>
        <div className="space-y-3">
          {society.contacts.map((contact, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder={`Contact Person ${index + 1} Name`}
                value={contact.name}
                onChange={(e) => {
                  const newContacts = [...society.contacts];
                  newContacts[index].name = e.target.value;
                  setSociety({...society, contacts: newContacts});
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
              <div className="flex space-x-2">
                <input
                  type="tel"
                  placeholder={`Contact Person ${index + 1} Phone`}
                  value={contact.phone}
                  onChange={(e) => {
                    const newContacts = [...society.contacts];
                    newContacts[index].phone = e.target.value;
                    setSociety({...society, contacts: newContacts});
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
                {society.contacts.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isNew && (
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={society.isActive}
              onChange={(e) => setSociety({...society, isActive: e.target.checked})}
              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 mr-2"
            />
            <span className="text-sm text-gray-700">Active (visible to public)</span>
          </label>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {isNew ? 'Add Society' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

// Society Edit Form Component (inline editing)
const SocietyEditForm = ({ society, onSave, onCancel }) => {
  const [formData, setFormData] = useState(society);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate before saving
    const requiredFields = ['name', 'howToJoin', 'meetingDate', 'meetingTime', 'coordinator'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (missingFields.length > 0) {
      alert(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Validate contacts
    const invalidContacts = formData.contacts.some(
      contact => !contact.name.trim() || !contact.phone.trim()
    );
    
    if (invalidContacts) {
      alert('All contacts must have both name and phone number');
      return;
    }
    
    onSave(society._id, formData);
  };

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { name: "", phone: "" }]
    });
  };

  const removeContact = (index) => {
    if (formData.contacts.length > 2) {
      setFormData({
        ...formData,
        contacts: formData.contacts.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Society Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coordinator</label>
          <input
            type="text"
            value={formData.coordinator}
            onChange={(e) => setFormData({...formData, coordinator: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Date</label>
          <input
            type="text"
            value={formData.meetingDate}
            onChange={(e) => setFormData({...formData, meetingDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time</label>
          <input
            type="text"
            value={formData.meetingTime}
            onChange={(e) => setFormData({...formData, meetingTime: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">How to Join</label>
        <textarea
          value={formData.howToJoin}
          onChange={(e) => setFormData({...formData, howToJoin: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          rows="3"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Contact Persons</label>
          <button
            type="button"
            onClick={addContact}
            className="text-amber-600 hover:text-amber-700 text-sm flex items-center"
          >
            <Plus size={14} className="mr-1" />
            Add Contact
          </button>
        </div>
        <div className="space-y-3">
          {formData.contacts.map((contact, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Contact Name"
                value={contact.name}
                onChange={(e) => {
                  const newContacts = [...formData.contacts];
                  newContacts[index].name = e.target.value;
                  setFormData({...formData, contacts: newContacts});
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
              <div className="flex space-x-2">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={contact.phone}
                  onChange={(e) => {
                    const newContacts = [...formData.contacts];
                    newContacts[index].phone = e.target.value;
                    setFormData({...formData, contacts: newContacts});
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
                {formData.contacts.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 mr-2"
          />
          <span className="text-sm text-gray-700">Active (visible to public)</span>
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  );
};

// Society Preview Component
const SocietyPreview = ({ society }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100">
      <div className="bg-gradient-to-r from-amber-700 to-amber-800 p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">{society.name}</h3>
        <div className="flex items-center text-amber-100">
          <Users className="w-4 h-4 mr-2" />
          <span className="text-sm">Led by {society.coordinator}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-amber-700" />
              Meeting Schedule
            </h4>
            <p className="text-gray-600 text-sm">{society.meetingDate}</p>
            <p className="text-gray-600 text-sm">{society.meetingTime}</p>
          </div>

          <div className={`transition-all duration-300 ${expanded ? 'block' : 'hidden'}`}>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">How to Join</h4>
              <p className="text-gray-600 text-sm">{society.howToJoin}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-amber-700" />
                Contact Information
              </h4>
              <div className="space-y-2">
                {society.contacts.map((contact, index) => (
                  <div key={index} className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <p className="font-medium text-gray-800 text-sm">{contact.name}</p>
                    <p className="text-amber-700 text-sm font-medium">{contact.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-4 bg-amber-700 text-white py-2 px-4 rounded-lg hover:bg-amber-800 transition-colors flex items-center justify-center"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                View Details <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
      
      {!society.isActive && (
        <div className="bg-red-50 border-t border-red-200 p-3">
          <p className="text-red-700 text-sm font-medium">⚠️ This society is currently inactive and not visible to the public</p>
        </div>
      )}
    </div>
  );
};

export default ParishSocietiesAdminUI;