import React from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight, Star } from 'lucide-react';

const UpcomingEventsPreview = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Youth Fellowship Night',
      date: '2025-05-25',
      time: '6:00 PM',
      location: 'Parish Hall',
      category: 'Youth',
      description: 'Join our young adults for an evening of worship, games, and fellowship.',
      attendees: 45,
      maxAttendees: 60,
      image: '🎵',
      featured: true,
      organizer: 'Youth Ministry'
    },
    {
      id: 2,
      title: 'St. Vincent de Paul Food Drive',
      date: '2025-05-28',
      time: '9:00 AM',
      location: 'Church Entrance',
      category: 'Charity',
      description: 'Help us collect food items for families in need in our community.',
      attendees: 20,
      maxAttendees: 30,
      image: '🍞',
      featured: false,
      organizer: 'St. Vincent de Paul Society'
    },
    {
      id: 3,
      title: 'First Friday Adoration',
      date: '2025-06-01',
      time: '7:00 PM',
      location: 'Main Church',
      category: 'Spiritual',
      description: 'Monthly Eucharistic Adoration with prayers and reflection.',
      attendees: 80,
      maxAttendees: 120,
      image: '🕯️',
      featured: true,
      organizer: 'Parish Liturgy Committee'
    },
    {
      id: 4,
      title: 'Marriage Enrichment Seminar',
      date: '2025-06-03',
      time: '10:00 AM',
      location: 'Conference Room',
      category: 'Family',
      description: 'Strengthen your marriage with practical wisdom and spiritual guidance.',
      attendees: 15,
      maxAttendees: 25,
      image: '💒',
      featured: false,
      organizer: 'Family Life Ministry'
    },
    {
      id: 5,
      title: 'Children\'s Catechism Graduation',
      date: '2025-06-08',
      time: '11:30 AM',
      location: 'Main Church',
      category: 'Children',
      description: 'Celebrating our young ones completing their catechism classes.',
      attendees: 35,
      maxAttendees: 40,
      image: '🎓',
      featured: false,
      organizer: 'Religious Education'
    },
    {
      id: 6,
      title: 'Parish Annual Picnic',
      date: '2025-06-15',
      time: '12:00 PM',
      location: 'Parish Grounds',
      category: 'Community',
      description: 'Our biggest community gathering with food, games, and entertainment.',
      attendees: 200,
      maxAttendees: 300,
      image: '🎪',
      featured: true,
      organizer: 'Parish Council'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Youth': 'bg-blue-100 text-blue-800',
      'Charity': 'bg-green-100 text-green-800',
      'Spiritual': 'bg-purple-100 text-purple-800',
      'Family': 'bg-pink-100 text-pink-800',
      'Children': 'bg-yellow-100 text-yellow-800',
      'Community': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const featuredEvents = upcomingEvents.filter(event => event.featured);
  const regularEvents = upcomingEvents.filter(event => !event.featured);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us for these exciting parish activities and strengthen your faith community
          </p>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2 fill-current" />
              Featured Events
            </h3>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-yellow-200">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-4xl">{event.image}</div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-gray-800 mb-3">{event.title}</h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                        <span className="font-medium">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3 text-green-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 text-red-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-5 h-5 mr-3 text-purple-500" />
                        <span>{event.attendees}/{event.maxAttendees} registered</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Organized by {event.organizer}
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center">
                        Register Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Events */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">All Upcoming Events</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{event.image}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {event.attendees}/{event.maxAttendees} spots
                    </div>
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Don't Miss Out!</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Stay updated with all our parish events and activities. Subscribe to our newsletter 
            or follow us on social media for the latest announcements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              View Full Calendar
            </button>
            <button className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all">
              Subscribe to Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsPreview;