import React from 'react';
import { Clock, Calendar, MapPin, Users } from 'lucide-react';

const MassScheduleComponent = () => {
  const massSchedule = [
    {
      day: 'Sunday',
      masses: [
        { time: '6:30 AM', type: 'First Mass', language: 'English' },
        { time: '8:00 AM', type: 'Second Mass', language: 'English' },
        { time: '10:00 AM', type: 'Main Mass', language: 'English', special: 'Children\'s Mass' },
        { time: '5:00 PM', type: 'Evening Mass', language: 'English' }
      ],
      isToday: false
    },
    {
      day: 'Monday - Friday',
      masses: [
        { time: '6:00 AM', type: 'Morning Mass', language: 'English' },
        { time: '6:00 PM', type: 'Evening Mass', language: 'English' }
      ],
      isToday: true
    },
    {
      day: 'Saturday',
      masses: [
        { time: '6:00 AM', type: 'Morning Mass', language: 'English' },
        { time: '6:00 PM', type: 'Vigil Mass', language: 'English', special: 'Sunday Vigil' }
      ],
      isToday: false
    }
  ];

  const specialMasses = [
    { occasion: 'Holy Days of Obligation', time: '6:00 AM, 12:00 PM, 6:00 PM' },
    { occasion: 'Good Friday', time: '3:00 PM (Passion Service)' },
    { occasion: 'Easter Vigil', time: '8:00 PM (Saturday)' },
    { occasion: 'Christmas Eve', time: '6:00 PM, 10:00 PM (Midnight Mass)' }
  ];

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
              {daySchedule.masses.map((mass, massIndex) => (
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
                    <p className="text-sm text-amber-700 mt-1">Language: {mass.language}</p>
                  </div>
                </div>
              ))}
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
          {specialMasses.map((special, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-amber-200 hover:border-amber-400 transition-colors">
              <h4 className="text-lg font-semibold text-amber-900 mb-2">{special.occasion}</h4>
              <div className="flex items-center text-amber-800">
                <Clock className="w-4 h-4 mr-2 text-amber-900" />
                <span>{special.time}</span>
              </div>
            </div>
          ))}
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
            St. Francis Catholic Church, Oregun<br />
            Lagos, Nigeria
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