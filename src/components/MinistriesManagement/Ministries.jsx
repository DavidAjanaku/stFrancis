// components/Ministries.js
import React from 'react';
import { Users, Music, Heart, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';

const Ministries = ({ data, setData, editingItem, setEditingItem }) => {
  const ministries = data?.ministries || [];

  const handleAddMinistry = () => {
    const newMinistry = {
      id: Date.now(),
      name: '',
      description: '',
      coordinator: ''
    };
    setEditingItem(newMinistry);
  };

  const handleEditMinistry = (ministry) => {
    setEditingItem(ministry);
  };

  const handleDeleteMinistry = (id) => {
    setData(prev => ({
      ...prev,
      ministries: prev.ministries.filter(ministry => ministry.id !== id)
    }));
  };

  const handleSaveMinistry = (ministry) => {
    if (ministry.name.trim()) {
      setData(prev => ({
        ...prev,
        ministries: ministry.id && prev.ministries.find(m => m.id === ministry.id)
          ? prev.ministries.map(m => m.id === ministry.id ? ministry : m)
          : [...prev.ministries, { ...ministry, id: ministry.id || Date.now() }]
      }));
    }
    setEditingItem(null);
  };

  const getMinistryIcon = (name) => {
    const iconMap = {
      'Youth Group': Users,
      'Choir': Music,
      'Outreach Program': Heart,
      'Bible Study': Users
    };
    return iconMap[name] || Users;
  };

  if (editingItem) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {editingItem.id && ministries.find(m => m.id === editingItem.id) ? 'Edit Ministry' : 'Add New Ministry'}
          </h1>
          <button
            onClick={() => setEditingItem(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSaveMinistry(editingItem);
          }}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ministry Name
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter ministry name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter ministry description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coordinator
                </label>
                <input
                  type="text"
                  value={editingItem.coordinator}
                  onChange={(e) => setEditingItem({...editingItem, coordinator: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter coordinator name"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Ministry
              </button>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parish Ministries</h1>
          <p className="text-gray-600">Manage church ministries and their coordinators</p>
        </div>
        <button
          onClick={handleAddMinistry}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Ministry
        </button>
      </div>

      {ministries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Ministries Yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first ministry</p>
          <button
            onClick={handleAddMinistry}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Ministry
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministries.map((ministry) => {
            const IconComponent = getMinistryIcon(ministry.name);
            return (
              <div key={ministry.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <IconComponent className="h-12 w-12 text-blue-600" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditMinistry(ministry)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMinistry(ministry.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{ministry.name}</h3>
                <p className="text-gray-600 mb-4">{ministry.description}</p>
                
                {ministry.coordinator && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500">Coordinator</p>
                    <p className="font-medium text-gray-900">{ministry.coordinator}</p>
                  </div>
                )}
                
                <button className="mt-4 text-blue-600 hover:text-blue-700 font-semibold flex items-center">
                  Learn More <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Ministries;