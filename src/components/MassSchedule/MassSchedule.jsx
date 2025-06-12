// components/MassSchedule/MassSchedule.js
import React, { useState } from 'react';
import { Church, Clock, Heart, Edit3, Plus, Trash2 } from 'lucide-react';
import { SectionHeader, EditModal } from '../shared/SharedComponents';

const MassSchedule = ({ data, editingItem, setEditingItem }) => {
  const [editData, setEditData] = useState({
    sunday: [...data.massSchedule.sunday],
    weekday: [...data.massSchedule.weekday],
    confession: data.massSchedule.confession ? [...data.massSchedule.confession] : [],
    specialEvents: data.massSchedule.specialEvents ? [...data.massSchedule.specialEvents] : []
  });

  const handleSave = () => {
    // Here you would typically update your main data state
    console.log('Saving mass schedule:', editData);
    setEditingItem(null);
  };

  const handleCancel = () => {
    // Reset edit data to original
    setEditData({
      sunday: [...data.massSchedule.sunday],
      weekday: [...data.massSchedule.weekday],
      confession: data.massSchedule.confession ? [...data.massSchedule.confession] : [],
      specialEvents: data.massSchedule.specialEvents ? [...data.massSchedule.specialEvents] : []
    });
    setEditingItem(null);
  };

  const addSundayMass = () => {
    setEditData(prev => ({
      ...prev,
      sunday: [...prev.sunday, { time: '', type: '' }]
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

  const addWeekdayMass = () => {
    setEditData(prev => ({
      ...prev,
      weekday: [...prev.weekday, { day: '', time: '' }]
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
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Sunday Masses
          </h3>
          <div className="space-y-2">
            {data.massSchedule.sunday.map((mass, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800">{mass.time}</span>
                <span className="text-blue-600">{mass.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekday Masses */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-green-600" />
            Weekday Masses
          </h3>
          <div className="space-y-2">
            {data.massSchedule.weekday.map((mass, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-800">{mass.day}</span>
                <span className="text-green-600">{mass.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confession Times */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-purple-600" />
            Confession Times
          </h3>
          <div className="space-y-2">
            {data.massSchedule.confession?.map((confession, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-800">{confession.day}</span>
                <span className="text-purple-600">{confession.time}</span>
              </div>
            )) || (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-600 text-center">
                No confession times scheduled
              </div>
            )}
          </div>
        </div>

        {/* Special Events/Holy Days (Optional) */}
        {data.massSchedule.specialEvents && data.massSchedule.specialEvents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Church className="w-5 h-5 mr-2 text-amber-600" />
              Special Events & Holy Days
            </h3>
            <div className="space-y-2">
              {data.massSchedule.specialEvents.map((event, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span className="font-medium text-amber-800">{event.name}</span>
                  <span className="text-amber-600">{event.time}</span>
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
                      placeholder="Time (e.g., 8:00 AM)"
                      value={mass.time}
                      onChange={(e) => updateSundayMass(index, 'time', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Type (e.g., Regular Mass)"
                      value={mass.type}
                      onChange={(e) => updateSundayMass(index, 'type', e.target.value)}
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
                  <div key={index} className="flex gap-2 items-center p-3 bg-green-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Day (e.g., Monday-Friday)"
                      value={mass.day}
                      onChange={(e) => updateWeekdayMass(index, 'day', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      placeholder="Time (e.g., 7:00 AM)"
                      value={mass.time}
                      onChange={(e) => updateWeekdayMass(index, 'time', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
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
                      placeholder="Day (e.g., Saturday)"
                      value={confession.day}
                      onChange={(e) => updateConfession(index, 'day', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Time (e.g., 4:00-5:00 PM)"
                      value={confession.time}
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
                      placeholder="Event Name (e.g., Christmas Eve)"
                      value={event.name}
                      onChange={(e) => updateSpecialEvent(index, 'name', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Time (e.g., 11:00 PM)"
                      value={event.time}
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