import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

const LiturgicalCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3); // Show 3 events initially

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://stfrancis-52b1.onrender.com/api/liturgical-calendar/upcoming');
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

  const loadMoreEvents = () => {
    setVisibleCount(prev => prev + 3);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 px-4 fade-in opacity-0 transition-opacity duration-1000">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-primary text-center">Liturgical Calendar Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-64"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 fade-in opacity-0 transition-opacity duration-1000">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-primary">Liturgical Calendar Highlights</h2>
          <p className="text-red-500">Error loading events: {error}</p>
        </div>
      </section>
    );
  }

  if (!events || events.length === 0) {
    return (
      <section className="py-16 px-4 fade-in opacity-0 transition-opacity duration-1000">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-primary">Liturgical Calendar Highlights</h2>
          <div className="text-black p-8 rounded-lg">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-secondary" />
            <h3 className="text-2xl font-semibold mb-4">No upcoming events</h3>
            <p className="max-w-2xl mx-auto">
              Check back later for upcoming liturgical events.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 fade-in opacity-0 transition-opacity duration-1000">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-primary text-center">Liturgical Calendar Highlights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, visibleCount).map((event) => (
            <div 
              key={event._id} 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-8 w-8 text-secondary mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
                </div>
                
                <div className="flex items-center mb-3 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(event.date)}</span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {event.liturgicalSeason}
                  </span>
                  
                  {event.isHighlight && (
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {visibleCount < events.length && (
          <div className="text-center mt-10">
            <button
              onClick={loadMoreEvents}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Load More Events
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
            <p className="text-gray-500 mt-2 text-sm">
              Showing {Math.min(visibleCount, events.length)} of {events.length} events
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiturgicalCalendar;