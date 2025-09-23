import React, { useState, useEffect } from 'react';
import { Users, Calendar, Phone, Edit3, Plus, Save, X, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

const ParishSocietiesPage = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newSociety, setNewSociety] = useState({
    name: '',
    howToJoin: '',
    meetingDate: '',
    meetingTime: '',
    coordinator: '',
    contacts: [{ name: '', phone: '' }, { name: '', phone: '' }],
    isActive: true,
  });

  // Fetch active societies for public view
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await fetch('https://distinct-stranger-production.up.railway.app/api/parish-societies/active');
        if (!response.ok) throw new Error('Failed to fetch societies');
        const data = await response.json();
        setSocieties(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load societies data');
        setLoading(false);
        console.error('Error fetching societies:', err);
      }
    };

    if (!isAdminMode) {
      fetchSocieties();
    }
  }, [isAdminMode]);

  const toggleCard = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Public View Component
  const PublicView = () => {
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Parish Societies & Organizations</h1>
              <p className="text-xl text-amber-100 max-w-3xl mx-auto">
                Join one of our vibrant parish communities and grow in faith together. Each society offers unique
                opportunities for spiritual growth, fellowship, and service.
              </p>
            </div>
          </div>
        </div>

        {/* Societies Grid */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {societies.map((society) => (
              <div
                key={society._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100"
              >
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

                    <div className={`transition-all duration-300 ${expandedCards[society._id] ? 'block' : 'hidden'}`}>
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
                      onClick={() => toggleCard(society._id)}
                      className="w-full mt-4 bg-amber-700 text-white py-2 px-4 rounded-lg hover:bg-amber-800 transition-colors flex items-center justify-center"
                    >
                      {expandedCards[society._id] ? (
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
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center bg-white rounded-xl shadow-lg p-8 border border-amber-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Join a Parish Society?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Each of our societies welcomes new members with open arms. Contact any of the coordinators listed above or
              visit our Linktree to reach the parish office.
            </p>
            <button
              onClick={() => window.open('https://linktr.ee/StFrancisOregun?utm_source=linktree_profile_share&ltsid=ee016b89-af0d-4f15-a8f9-6e1cca54e9b5', '_blank')}
              className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition-colors font-medium"
            >
              Contact Parish Office
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Admin View Component (using static data for now)
  const AdminView = () => {
    // Static data for admin view (to be replaced with API if needed)
    const staticSocieties = [
      {
        id: 1,
        name: 'Catholic Women Organization',
        howToJoin: 'Contact any CWO member or visit during our monthly meetings',
        meetingDate: 'First Sunday of every month',
        meetingTime: 'After 10:00 AM Mass',
        coordinator: 'Mrs. Adaora Okafor',
        contacts: [
          { name: 'Mrs. Adaora Okafor', phone: '+234 803 123 4567' },
          { name: 'Mrs. Blessing Nwosu', phone: '+234 806 789 0123' },
        ],
        isActive: true,
      },
      // ... (include other static societies as in the original code)
    ];

    const handleEdit = (id) => {
      setEditingId(id);
    };

    const handleSave = (id, updatedData) => {
      setSocieties(staticSocieties.map((society) =>
        society.id === id ? { ...society, ...updatedData } : society
      ));
      setEditingId(null);
    };

    const handleDelete = (id) => {
      setSocieties(staticSocieties.filter((society) => society.id !== id));
    };

    const handleAddSociety = () => {
      const id = Math.max(...staticSocieties.map((s) => s.id)) + 1;
      setSocieties([...staticSocieties, { ...newSociety, id }]);
      setNewSociety({
        name: '',
        howToJoin: '',
        meetingDate: '',
        meetingTime: '',
        coordinator: '',
        contacts: [{ name: '', phone: '' }, { name: '', phone: '' }],
        isActive: true,
      });
      setShowAddForm(false);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsAdminMode(false)}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Public View
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Parish Societies Management</h1>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Society
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Add New Society</h2>
              <AddSocietyForm
                society={newSociety}
                setSociety={setNewSociety}
                onSave={handleAddSociety}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}

          <div className="space-y-6">
            {staticSocieties.map((society) => (
              <div key={society.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {editingId === society.id ? (
                  <EditSocietyForm
                    society={society}
                    onSave={handleSave}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <SocietyCard
                    society={society}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Society Card Component for Admin
  const SocietyCard = ({ society, onEdit, onDelete }) => (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{society.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(society.id)}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(society.id)}
            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-600 mb-2"><strong>How to Join:</strong> {society.howToJoin}</p>
          <p className="text-gray-600 mb-2"><strong>Meeting Date:</strong> {society.meetingDate}</p>
          <p className="text-gray-600 mb-2"><strong>Meeting Time:</strong> {society.meetingTime}</p>
          <p className="text-gray-600"><strong>Coordinator:</strong> {society.coordinator}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Contact Persons</h4>
          {society.contacts.map((contact, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
              <p className="font-medium">{contact.name}</p>
              <p className="text-blue-600">{contact.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Edit Form Component
  const EditSocietyForm = ({ society, onSave, onCancel }) => {
    const [formData, setFormData] = useState(society);

    const handleSubmit = () => {
      onSave(society.id, formData);
    };

    return (
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Society Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coordinator</label>
            <input
              type="text"
              value={formData.coordinator}
              onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Date</label>
            <input
              type="text"
              value={formData.meetingDate}
              onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time</label>
            <input
              type="text"
              value={formData.meetingTime}
              onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">How to Join</label>
          <textarea
            value={formData.howToJoin}
            onChange={(e) => setFormData({ ...formData, howToJoin: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            rows="3"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Persons</label>
          {formData.contacts.map((contact, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-4 mb-3">
              <input
                type="text"
                placeholder="Contact Name"
                value={contact.name}
                onChange={(e) => {
                  const newContacts = [...formData.contacts];
                  newContacts[index].name = e.target.value;
                  setFormData({ ...formData, contacts: newContacts });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={contact.phone}
                onChange={(e) => {
                  const newContacts = [...formData.contacts];
                  newContacts[index].phone = e.target.value;
                  setFormData({ ...formData, contacts: newContacts });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  // Add Society Form Component
  const AddSocietyForm = ({ society, setSociety, onSave, onCancel }) => {
    const handleSubmit = () => {
      onSave();
    };

    return (
      <div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Society Name</label>
            <input
              type="text"
              value={society.name}
              onChange={(e) => setSociety({ ...society, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coordinator</label>
            <input
              type="text"
              value={society.coordinator}
              onChange={(e) => setSociety({ ...society, coordinator: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Date</label>
            <input
              type="text"
              value={society.meetingDate}
              onChange={(e) => setSociety({ ...society, meetingDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g., Every Sunday"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time</label>
            <input
              type="text"
              value={society.meetingTime}
              onChange={(e) => setSociety({ ...society, meetingTime: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g., 4:00 PM - 6:00 PM"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">How to Join</label>
          <textarea
            value={society.howToJoin}
            onChange={(e) => setSociety({ ...society, howToJoin: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            rows="3"
            placeholder="Describe how interested members can join this society"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Persons (2 required)</label>
          {society.contacts.map((contact, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-4 mb-3">
              <input
                type="text"
                placeholder={`Contact Person ${index + 1} Name`}
                value={contact.name}
                onChange={(e) => {
                  const newContacts = [...society.contacts];
                  newContacts[index].name = e.target.value;
                  setSociety({ ...society, contacts: newContacts });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
              <input
                type="tel"
                placeholder={`Contact Person ${index + 1} Phone`}
                value={contact.phone}
                onChange={(e) => {
                  const newContacts = [...society.contacts];
                  newContacts[index].phone = e.target.value;
                  setSociety({ ...society, contacts: newContacts });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Society
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Render appropriate view */}
      {isAdminMode ? <AdminView /> : <PublicView />}
    </div>
  );
};

export default ParishSocietiesPage;