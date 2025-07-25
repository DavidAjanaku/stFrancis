import React, { useState, useEffect } from 'react';
import { Church, Clock, Heart, Edit3, Plus, Trash2 } from 'lucide-react';
import { SectionHeader, EditModal } from '../shared/SharedComponents';

const MassSchedule = ({ editingItem, setEditingItem }) => {
  // State for edit data and loading status
  const [editData, setEditData] = useState({
    sunday: [],
    weekday: [],
    confession: [],
    specialEvents: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://distinct-stranger-production.up.railway.app/api/mass-schedule');
        if (!response.ok) throw new Error('Failed to fetch mass schedule');
        
        const data = await response.json();
        setEditData({
          sunday: data.sunday || [],
          weekday: data.weekday || [],
          confession: data.confession || [],
          specialEvents: data.specialEvents || []
        });
        // Save original data for cancel operations
        setOriginalData({
          sunday: [...data.sunday || []],
          weekday: [...data.weekday || []],
          confession: [...data.confession || []],
          specialEvents: [...data.specialEvents || []]
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mass handling functions
  const addSundayMass = () => {
    setEditData(prev => ({
      ...prev,
      sunday: [...prev.sunday, { time: '', type: '', language: '', special: '' }]
    }));
  };

  const removeSundayMass = (index) => {
    setEditData(prev => ({
      ...prev,
      sunday: prev.sunday.filter((_, i) => i !== index)
    }));
  };

  const updateSundayMass = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      sunday: prev.sunday.map((mass, i) => 
        i === index ? { ...mass, [field]: value } : mass
      )
    }));
  };

  // Weekday Masses functions
  const addWeekdayMass = () => {
    setEditData(prev => ({
      ...prev,
      weekday: [...prev.weekday, { day: '', time: '', type: '' }]
    }));
  };

  const removeWeekdayMass = (index) => {
    setEditData(prev => ({
      ...prev,
      weekday: prev.weekday.filter((_, i) => i !== index)
    }));
  };

  const updateWeekdayMass = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      weekday: prev.weekday.map((mass, i) => 
        i === index ? { ...mass, [field]: value } : mass
      )
    }));
  };

  // Confession Times functions
  const addConfession = () => {
    setEditData(prev => ({
      ...prev,
      confession: [...prev.confession, { day: '', time: '' }]
    }));
  };

  const removeConfession = (index) => {
    setEditData(prev => ({
      ...prev,
      confession: prev.confession.filter((_, i) => i !== index)
    }));
  };

  const updateConfession = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      confession: prev.confession.map((conf, i) => 
        i === index ? { ...conf, [field]: value } : conf
      )
    }));
  };

  // Special Events functions
  const addSpecialEvent = () => {
    setEditData(prev => ({
      ...prev,
      specialEvents: [...prev.specialEvents, { name: '', time: '' }]
    }));
  };

  const removeSpecialEvent = (index) => {
    setEditData(prev => ({
      ...prev,
      specialEvents: prev.specialEvents.filter((_, i) => i !== index)
    }));
  };

  const updateSpecialEvent = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      specialEvents: prev.specialEvents.map((event, i) => 
        i === index ? { ...event, [field]: value } : event
      )
    }));
  };

  // Save handler
  const handleSave = async () => {
    try {
      const response = await fetch('https://distinct-stranger-production.up.railway.app/api/mass-schedule', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save schedule');
      }

      // Update local state with saved data
      const savedSchedule = await response.json();
      setEditData({
        sunday: savedSchedule.sunday || [],
        weekday: savedSchedule.weekday || [],
        confession: savedSchedule.confession || [],
        specialEvents: savedSchedule.specialEvents || []
      });
      setOriginalData({
        sunday: [...savedSchedule.sunday || []],
        weekday: [...savedSchedule.weekday || []],
        confession: [...savedSchedule.confession || []],
        specialEvents: [...savedSchedule.specialEvents || []]
      });
      
      // Close the modal
      setEditingItem(null);
      
    } catch (error) {
      console.error('Save error:', error);
      alert(`Save failed: ${error.message}`);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (originalData) {
      setEditData({
        sunday: [...originalData.sunday],
        weekday: [...originalData.weekday],
        confession: [...originalData.confession],
        specialEvents: [...originalData.specialEvents]
      });
    }
    setEditingItem(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading mass schedule...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <SectionHeader
          title="Mass Schedule"
          icon={Church}
          buttonIcon={Edit3}
          buttonText="Edit Schedule"
          onButtonClick={() => setEditingItem('mass-schedule')}
        />
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg text-red-600 mb-2">Error Loading Schedule</p>
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

  // Normal display
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <SectionHeader
        title="Mass Schedule"
        icon={Church}
        buttonIcon={Edit3}
        buttonText="Edit Schedule"
        onButtonClick={() => setEditingItem('mass-schedule')}
      />
      
      <div className="space-y-6">
        {/* Sunday Masses */}
        <div className="border-l-4 border-blue-500 pl-4 py-2">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Sunday Masses
          </h3>
          <div className="space-y-2">
            {editData.sunday.length > 0 ? (
              editData.sunday.map((mass, index) => (
                <div key={index} className="flex items-center py-2">
                  <div className="font-medium text-gray-700 w-24">{mass.time}</div>
                  <div className="text-gray-600">{mass.type}</div>
                  {mass.language && (
                    <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {mass.language}
                    </span>
                  )}
                  {mass.special && (
                    <span className="ml-2 text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                      {mass.special}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No Sunday masses scheduled</p>
            )}
          </div>
        </div>

        {/* Weekday Masses */}
        <div className="border-l-4 border-green-500 pl-4 py-2">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
            <Clock className="w-5 h-5 mr-2 text-green-600" />
            Weekday Masses
          </h3>
          <div className="space-y-2">
            {editData.weekday.length > 0 ? (
              editData.weekday.map((mass, index) => (
                <div key={index} className="flex items-center py-2">
                  <div className="font-medium text-gray-700 w-32">{mass.day}</div>
                  <div className="text-gray-600 w-20">{mass.time}</div>
                  <div className="text-gray-600">{mass.type}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No weekday masses scheduled</p>
            )}
          </div>
        </div>

        {/* Confession Times */}
        <div className="border-l-4 border-purple-500 pl-4 py-2">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
            <Heart className="w-5 h-5 mr-2 text-purple-600" />
            Confession Times
          </h3>
          <div className="space-y-2">
            {editData.confession.length > 0 ? (
              editData.confession.map((confession, index) => (
                <div key={index} className="flex items-center py-2">
                  <div className="font-medium text-gray-700 w-32">{confession.day}</div>
                  <div className="text-gray-600">{confession.time}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No confession times scheduled</p>
            )}
          </div>
        </div>

        {/* Special Events */}
        {editData.specialEvents.length > 0 && (
          <div className="border-l-4 border-amber-500 pl-4 py-2">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
              <Church className="w-5 h-5 mr-2 text-amber-600" />
              Special Events
            </h3>
            <div className="space-y-2">
              {editData.specialEvents.map((event, index) => (
                <div key={index} className="flex items-center py-2">
                  <div className="font-medium text-gray-700">{event.name}</div>
                  <div className="ml-4 text-gray-600">{event.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem === 'mass-schedule' && (
        <EditModal
          title="Edit Mass Schedule"
          onSave={handleSave}
          onCancel={handleCancel}
        >
          <div className="space-y-6">
            {/* Sunday Masses Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Sunday Masses
                </h4>
                <button
                  onClick={addSundayMass}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {editData.sunday.map((mass, index) => (
                  <div key={index} className="flex gap-2 items-center p-3 bg-blue-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Time (e.g., 9:00 AM)"
                      value={mass.time || ''}
                      onChange={(e) => updateSundayMass(index, 'time', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Type (e.g., Family Mass)"
                      value={mass.type || ''}
                      onChange={(e) => updateSundayMass(index, 'type', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Language"
                      value={mass.language || ''}
                      onChange={(e) => updateSundayMass(index, 'language', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Special Notes"
                      value={mass.special || ''}
                      onChange={(e) => updateSundayMass(index, 'special', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeSundayMass(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekday Masses Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  Weekday Masses
                </h4>
                <button
                  onClick={addWeekdayMass}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {editData.weekday.map((mass, index) => (
                  <div key={index} className="flex flex-wrap gap-2 items-center p-3 bg-green-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Days (e.g., Mon-Fri)"
                      value={mass.day || ''}
                      onChange={(e) => updateWeekdayMass(index, 'day', e.target.value)}
                      className="flex-1 min-w-[120px] p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      placeholder="Time"
                      value={mass.time || ''}
                      onChange={(e) => updateWeekdayMass(index, 'time', e.target.value)}
                      className="flex-1 min-w-[100px] p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      placeholder="Type"
                      value={mass.type || ''}
                      onChange={(e) => updateWeekdayMass(index, 'type', e.target.value)}
                      className="flex-1 min-w-[120px] p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={() => removeWeekdayMass(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Confession Times Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-purple-600" />
                  Confession Times
                </h4>
                <button
                  onClick={addConfession}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {editData.confession.map((confession, index) => (
                  <div key={index} className="flex gap-2 items-center p-3 bg-purple-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Day"
                      value={confession.day || ''}
                      onChange={(e) => updateConfession(index, 'day', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Time"
                      value={confession.time || ''}
                      onChange={(e) => updateConfession(index, 'time', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => removeConfession(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Events Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Church className="w-5 h-5 mr-2 text-amber-600" />
                  Special Events & Holy Days
                </h4>
                <button
                  onClick={addSpecialEvent}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {editData.specialEvents.map((event, index) => (
                  <div key={index} className="flex gap-2 items-center p-3 bg-amber-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Event Name"
                      value={event.name || ''}
                      onChange={(e) => updateSpecialEvent(index, 'name', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Time"
                      value={event.time || ''}
                      onChange={(e) => updateSpecialEvent(index, 'time', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => removeSpecialEvent(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </EditModal>
      )}
    </div>
  );
};

export default MassSchedule;