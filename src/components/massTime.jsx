// components/MassScheduleComponent.js
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Users } from 'lucide-react';

const MassScheduleComponent = () => {
  const [massSchedule, setMassSchedule] = useState([]);
  const [specialMasses, setSpecialMasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({
    name: 'St. Francis Catholic Church, Oregun',
    address: 'Lagos, Nigeria'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the full backend URL
        const response = await fetch('http://localhost:5001/api/mass-schedule');
        console.log(response);
        
        if (!response.ok) throw new Error('Failed to fetch mass schedule');
        
        const data = await response.json();
        console.log(data);
        
        
        // Transform data to match frontend structure
        const today = new Date().getDay();
        const transformed = [
          {
            day: 'Sunday',
            masses: data.sunday || [],
            isToday: today === 0
          },
          {
            day: 'Monday - Friday',
            masses: data.weekday || [],
            isToday: today >= 1 && today <= 5
          },
          {
            day: 'Saturday',
            masses: data.weekday.filter(m => m.day && m.day.includes('Saturday')) || [],
            isToday: today === 6
          }
        ];
        
        setMassSchedule(transformed);
        setSpecialMasses(data.specialEvents || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-900 mx-auto mb-4"></div>
          <p className="text-xl text-amber-900">Loading Mass Schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xl text-red-600 mb-2">Error Loading Schedule</p>
          <p className="text-amber-800 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-amber-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-amber-50">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 border-2 border-amber-300">
          <Calendar className="w-8 h-8 text-amber-900" />
        </div>
        <h2 className="text-4xl font-bold text-amber-900 mb-4">Mass Schedule</h2>
        <p className="text-xl text-amber-800">Join us for the celebration of the Holy Eucharist</p>
      </div>

      {/* Regular Mass Schedule */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {massSchedule.map((daySchedule, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
              daySchedule.isToday ? 'border-amber-900 bg-amber-100' : 'border-amber-200 hover:border-amber-400'
            }`}
          >
            <div className={`p-6 rounded-t-2xl ${
              daySchedule.isToday ? 'bg-amber-900 text-white' : 'bg-amber-100'
            }`}>
              <h3 className={`text-2xl font-bold ${
                daySchedule.isToday ? 'text-white' : 'text-amber-900'
              }`}>
                {daySchedule.day}
              </h3>
              {daySchedule.isToday && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-amber-900 mt-2">
                  <Clock className="w-4 h-4 mr-1" />
                  Today
                </span>
              )}
            </div>
            
            <div className="p-6 space-y-4">
              {daySchedule.masses.length > 0 ? (
                daySchedule.masses.map((mass, massIndex) => (
                  <div key={massIndex} className="flex items-start space-x-4 p-4 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center border border-amber-300">
                        <Clock className="w-6 h-6 text-amber-900" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-lg font-semibold text-amber-900">{mass.time}</h4>
                      <p className="text-amber-800">{mass.type}</p>
                      {mass.special && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-200 text-amber-900 mt-1 border border-amber-300">
                          {mass.special}
                        </span>
                      )}
                      <p className="text-sm text-amber-700 mt-1">Language: {mass.language || 'English'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-center text-amber-700">
                  No masses scheduled
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Special Occasions */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-2xl p-8 mb-8 border border-amber-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-200 rounded-full mb-4 border border-amber-300">
            <Users className="w-6 h-6 text-amber-900" />
          </div>
          <h3 className="text-2xl font-bold text-amber-900 mb-2">Special Occasions</h3>
          <p className="text-amber-800">Mass timings for holy days and special celebrations</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {specialMasses.length > 0 ? (
            specialMasses.map((special, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-amber-200 hover:border-amber-400 transition-colors">
                <h4 className="text-lg font-semibold text-amber-900 mb-2">{special.name}</h4>
                <div className="flex items-center text-amber-800">
                  <Clock className="w-4 h-4 mr-2 text-amber-900" />
                  <span>{special.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white rounded-xl p-8 text-center border border-amber-200">
              <p className="text-amber-700">No special events scheduled</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-200">
          <div className="flex items-center mb-4">
            <MapPin className="w-6 h-6 text-amber-900 mr-3" />
            <h3 className="text-xl font-bold text-amber-900">Location</h3>
          </div>
          <p className="text-amber-800 mb-4">
            {location.name}<br />
            {location.address}
          </p>
          <button className="bg-amber-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors shadow-sm">
            Get Directions
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-200">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-amber-900 mr-3" />
            <h3 className="text-xl font-bold text-amber-900">Important Notes</h3>
          </div>
          <ul className="space-y-3 text-amber-800">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Please arrive 10-15 minutes before Mass begins
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Confession available 30 minutes before each Mass
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Special arrangements for First Friday and First Saturday
            </li>
          </ul>
        </div>
      </div>

      {/* Contact for More Info */}
      <div className="text-center mt-12 p-8 bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl border border-amber-300">
        <h3 className="text-xl font-bold text-amber-900 mb-4">Need More Information?</h3>
        <p className="text-amber-800 mb-6">Contact our parish office for special Mass arrangements or inquiries</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center shadow-sm">
            <span className="mr-2">📱</span>
            WhatsApp Us
          </button>
          <button className="bg-amber-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors shadow-sm">
            Call Parish Office
          </button>
        </div>
      </div>
    </div>
  );
};

export default MassScheduleComponent;