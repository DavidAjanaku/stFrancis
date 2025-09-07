import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Users, ChevronDown, ChevronUp, Star } from 'lucide-react';

const MassScheduleComponent = () => {
  const [massSchedule, setMassSchedule] = useState([]);
  const [specialMasses, setSpecialMasses] = useState([]);
  const [confessionSchedule, setConfessionSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (day) => {
    setExpandedSections(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const getDayName = (dayIndex) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  };

  const getCurrentDay = () => {
    return new Date().getDay();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://distinct-stranger-production.up.railway.app/api/mass-schedule');
        
        if (!response.ok) throw new Error('Failed to fetch mass schedule');
        
        const data = await response.json();
        console.log('API Data:', data);
        
        // Process weekday data by individual days
        const weekdaysByDay = {};
        data.weekday.forEach(mass => {
          let dayKey = mass.day.toLowerCase();
          
          // Handle typos and variations
          if (dayKey === 'tuedays') dayKey = 'tuesday';
          
          // Map to proper day names
          const dayMap = {
            'monday': 'Monday',
            'tuesday': 'Tuesday', 
            'wednesday': 'Wednesday',
            'thursday': 'Thursday',
            'friday': 'Friday',
            'saturday': 'Saturday'
          };
          
          const properDay = dayMap[dayKey];
          if (properDay) {
            if (!weekdaysByDay[properDay]) {
              weekdaysByDay[properDay] = [];
            }
            weekdaysByDay[properDay].push(mass);
          }
        });

        const today = getCurrentDay();
        const todayName = getDayName(today);
        
        // Create schedule array with individual days
        const schedule = [];
        
        // Add Sunday
        schedule.push({
          day: 'Sunday',
          dayIndex: 0,
          masses: data.sunday || [],
          isToday: today === 0,
          color: 'blue'
        });

        // Add individual weekdays
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach((day, index) => {
          schedule.push({
            day: day,
            dayIndex: index + 1,
            masses: weekdaysByDay[day] || [],
            isToday: today === (index + 1),
            color: 'amber'
          });
        });

        // Add Saturday
        schedule.push({
          day: 'Saturday',
          dayIndex: 6,
          masses: weekdaysByDay['Saturday'] || [],
          isToday: today === 6,
          color: 'emerald'
        });
        
        setMassSchedule(schedule);
        setSpecialMasses(data.specialEvents || []);
        setConfessionSchedule(data.confession || []);
        
        // Auto-expand today's schedule
        setExpandedSections({ [todayName]: true });
        
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
      <div className=" mx-auto p-6 min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-900 mx-auto mb-4"></div>
          <p className="text-xl text-amber-900">Loading Mass Schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" mx-auto p-6 min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
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

  const getColorClasses = (color, isToday) => {
    const colors = {
      blue: {
        border: isToday ? 'border-blue-500' : 'border-blue-200',
        bg: isToday ? 'bg-blue-50' : 'bg-white',
        header: isToday ? 'bg-blue-600' : 'bg-blue-100',
        text: isToday ? 'text-white' : 'text-blue-900',
        accent: 'bg-blue-100 text-blue-900'
      },
      amber: {
        border: isToday ? 'border-amber-500' : 'border-amber-200',
        bg: isToday ? 'bg-amber-50' : 'bg-white',
        header: isToday ? 'bg-amber-600' : 'bg-amber-100',
        text: isToday ? 'text-white' : 'text-amber-900',
        accent: 'bg-amber-100 text-amber-900'
      },
      emerald: {
        border: isToday ? 'border-emerald-500' : 'border-emerald-200',
        bg: isToday ? 'bg-emerald-50' : 'bg-white',
        header: isToday ? 'bg-emerald-600' : 'bg-emerald-100',
        text: isToday ? 'text-white' : 'text-emerald-900',
        accent: 'bg-emerald-100 text-emerald-900'
      }
    };
    return colors[color] || colors.amber;
  };

  const getLocationShortName = (type) => {
    if (type.includes('St. Francis')) {
      return 'St. Francis Oregun';
    } else if (type.includes('Mother of Perpetual Help')) {
      return 'Mother of Perpetual Help Ikosi Ketu';
    }
    return type;
  };

  return (
    <div className=" mx-auto p-6 min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
          <Calendar className="w-8 h-8 text-amber-900" />
        </div>
        <h1 className="text-4xl font-bold text-amber-900 mb-2">Mass Schedule</h1>
        <p className="text-lg text-amber-700">Join us for the celebration of the Holy Eucharist</p>
      </div>

      {/* Daily Mass Schedule */}
      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        {massSchedule.map((daySchedule, index) => {
          const isExpanded = expandedSections[daySchedule.day];
          const colorClasses = getColorClasses(daySchedule.color, daySchedule.isToday);
          
          return (
            <div 
              key={index} 
              className={`rounded-xl shadow-lg border-2 transition-all duration-300 ${colorClasses.border} ${colorClasses.bg}`}
            >
              {/* Header - Always Visible */}
              <div 
                className={`p-4 rounded-t-xl cursor-pointer hover:opacity-90 transition-opacity ${colorClasses.header}`}
                onClick={() => toggleSection(daySchedule.day)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h2 className={`text-lg font-bold ${colorClasses.text}`}>
                      {daySchedule.day}
                    </h2>
                    {daySchedule.isToday && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-90 text-amber-900 flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Today
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${colorClasses.text} opacity-75`}>
                      {daySchedule.masses.length} Mass{daySchedule.masses.length !== 1 ? 'es' : ''}
                    </span>
                    {isExpanded ? 
                      <ChevronUp className={`w-4 h-4 ${colorClasses.text}`} /> : 
                      <ChevronDown className={`w-4 h-4 ${colorClasses.text}`} />
                    }
                  </div>
                </div>
                
                {/* Quick Preview */}
                {!isExpanded && daySchedule.masses.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {daySchedule.masses.slice(0, 2).map((mass, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white bg-opacity-90 rounded text-xs font-medium text-gray-700">
                        {mass.time}
                      </span>
                    ))}
                    {daySchedule.masses.length > 2 && (
                      <span className="px-2 py-1 bg-white bg-opacity-75 rounded text-xs font-medium text-gray-600">
                        +{daySchedule.masses.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Expandable Content */}
              {isExpanded && (
                <div className="p-4 space-y-3">
                  {daySchedule.masses.length > 0 ? (
                    daySchedule.masses.map((mass, massIndex) => (
                      <div key={massIndex} className="flex items-start space-x-3 p-3 rounded-lg bg-white shadow-sm border border-gray-200">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses.accent}`}>
                            <Clock className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm">{mass.time}</h4>
                          <p className="text-gray-700 text-xs mt-1">{getLocationShortName(mass.type)}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-600">{mass.language || 'English'}</span>
                            {mass.special && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                {mass.special}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-center text-gray-600 text-sm">
                      No masses scheduled for this day
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Special Events & Adoration */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Special Events */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-purple-900 mr-3" />
            <h3 className="text-xl font-bold text-purple-900">Special Events</h3>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {specialMasses.map((special, index) => (
              <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 text-sm">{special.name}</h4>
                <p className="text-purple-700 text-xs mt-1">{special.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Confession Schedule */}
     <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-green-900 mr-3" />
            <h3 className="text-xl font-bold text-green-900">Confession</h3>
          </div>
          {confessionSchedule.length > 0 ? (
            <div className="space-y-3">
              {confessionSchedule.map((confession, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 text-sm">{confession.day}</h4>
                  <p className="text-green-700 text-xs mt-1">{confession.time}</p>
                  {confession.details && (
                    <p className="text-green-600 text-xs mt-1">{confession.details}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
              <p className="text-green-700 text-sm">Available 30 minutes before each Mass</p>
              <p className="text-green-600 text-xs mt-1">Or by appointment</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
          <div className="flex items-center mb-3">
            <MapPin className="w-5 h-5 text-amber-900 mr-2" />
            <h3 className="text-lg font-bold text-amber-900">Our Locations</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="p-2 bg-amber-50 rounded border border-amber-200">
              <p className="font-medium text-amber-900">St. Francis Catholic Church</p>
              <p className="text-amber-700">Oregun, Lagos</p>
            </div>
            <div className="p-2 bg-amber-50 rounded border border-amber-200">
              <p className="font-medium text-amber-900">Mother of Perpetual Help</p>
              <p className="text-amber-700">Ikosi Ketu, Lagos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-amber-900 mr-2" />
            <h3 className="text-lg font-bold text-amber-900">Quick Info</h3>
          </div>
          <ul className="space-y-2 text-amber-800 text-sm">
            <li>• Arrive 10-15 minutes early</li>
            <li>• Confession 30 min before Mass</li>
            <li>• Special arrangements for feasts</li>
            <li>• Call for private Mass requests</li>
          </ul>
        </div>
      </div>

      {/* Contact */}
      {/* <div className="text-center mt-6 p-4 bg-amber-100 rounded-xl border border-amber-300">
        <h3 className="text-lg font-bold text-amber-900 mb-2">Need Help or Information?</h3>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-amber-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors text-sm flex items-center justify-center">
            📱 WhatsApp Us
          </button>
          <button className="bg-amber-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-800 transition-colors text-sm">
            Call Parish Office
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default MassScheduleComponent;