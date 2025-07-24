import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const LiturgicalCalendarAdmin = () => {
  const [events, setEvents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    liturgicalSeason: 'Ordinary Time',
    color: 'green',
    isHighlight: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const liturgicalSeasons = [
    'Advent', 'Christmas', 'Lent', 'Easter', 'Ordinary Time'
  ];

  const liturgicalColors = [
    { value: 'green', name: 'Green (Ordinary Time)', class: 'bg-green-500' },
    { value: 'purple', name: 'Purple (Advent/Lent)', class: 'bg-purple-500' },
    { value: 'white', name: 'White (Christmas/Easter)', class: 'bg-white border-2 border-gray-300' },
    { value: 'red', name: 'Red (Passion/Pentecost)', class: 'bg-red-500' },
    { value: 'rose', name: 'Rose (Gaudete/Laetare)', class: 'bg-pink-400' }
  ];

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://stfrancis-52b1.onrender.com/api/liturgical-calendar');
        if (!response.ok) throw new Error('Failed to fetch events');
        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const method = editingEvent ? 'PUT' : 'POST';
      const endpoint = editingEvent 
        ? `'https://stfrancis-52b1.onrender.com/api/liturgical-calendar/${editingEvent._id}`
        : 'https://stfrancis-52b1.onrender.com/api/liturgical-calendar';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save event');
      }
      
      const result = await response.json();
      
      if (editingEvent) {
        setEvents(prev => prev.map(event => 
          event._id === editingEvent._id ? result : event
        ));
      } else {
        setEvents(prev => [...prev, result]);
      }
      
      handleCancel();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      date: new Date(event.date).toISOString().split('T')[0],
      description: event.description,
      liturgicalSeason: event.liturgicalSeason,
      color: event.color,
      isHighlight: event.isHighlight
    });
    setShowAddForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`'https://stfrancis-52b1.onrender.com/api/liturgical-calendar/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete event');
      
      setEvents(prev => prev.filter(event => event._id !== eventId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingEvent(null);
    setFormData({
      name: '',
      date: '',
      description: '',
      liturgicalSeason: 'Ordinary Time',
      color: 'green',
      isHighlight: false
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getColorClass = (color) => {
    const colorMap = {
      green: 'bg-green-100 border-green-300',
      purple: 'bg-purple-100 border-purple-300',
      white: 'bg-gray-50 border-gray-300',
      red: 'bg-red-100 border-red-300',
      rose: 'bg-pink-100 border-pink-300'
    };
    return colorMap[color] || 'bg-gray-100 border-gray-300';
  };

  const getIconColor = (color) => {
    const colorMap = {
      green: 'text-green-600',
      purple: 'text-purple-600',
      white: 'text-gray-600',
      red: 'text-red-600',
      rose: 'text-pink-600'
    };
    return colorMap[color] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading liturgical events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Liturgical Calendar Admin</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Pentecost Sunday"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liturgical Season
                  </label>
                  <select
                    name="liturgicalSeason"
                    value={formData.liturgicalSeason}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {liturgicalSeasons.map(season => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liturgical Color
                  </label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {liturgicalColors.map(color => (
                      <option key={color.value} value={color.value}>{color.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the event..."
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isHighlight"
                  checked={formData.isHighlight}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Feature as highlight on main calendar
                </label>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="h-5 w-5" />
                  <span>{editingEvent ? 'Update Event' : 'Save Event'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Current Events</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {events.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No liturgical events found. Add your first event to get started.
              </div>
            ) : (
              events.map(event => (
                <div key={event._id} className={`p-6 ${getColorClass(event.color)} border-l-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <BookOpen className={`h-6 w-6 ${getIconColor(event.color)}`} />
                        <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
                        {event.isHighlight && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{formatDate(event.date)}</p>
                      <p className="text-gray-700 mb-2">{event.description}</p>
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>Season: {event.liturgicalSeason}</span>
                        <span>Color: {liturgicalColors.find(c => c.value === event.color)?.name}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiturgicalCalendarAdmin;