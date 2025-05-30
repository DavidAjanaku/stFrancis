import React, { useState } from 'react';
import { Bell, Calendar, User, Clock, ArrowRight, Download, Volume2, Pin, AlertCircle } from 'lucide-react';

const NewsAnnouncements = () => {
  const [activeTab, setActiveTab] = useState('all');

  const announcements = [
    {
      id: 1,
      title: 'New Mass Schedule Effective June 1st',
      content: 'Starting June 1st, we will be adding an additional Sunday Mass at 12:30 PM to accommodate our growing parish family. The new schedule will be: 6:30 AM, 8:00 AM, 10:00 AM, 12:30 PM, and 5:00 PM.',
      category: 'important',
      author: 'Fr. Michael Okafor',
      date: '2025-05-20',
      time: '10:30 AM',
      priority: 'high',
      pinned: true,
      hasAttachment: false
    },
    {
      id: 2,
      title: 'Parish Pilgrimage to Holy Land - Registration Open',
      content: 'Join us for a spiritual journey to the Holy Land from October 15-25, 2025. Limited spaces available. Early bird registration ends June 30th. Contact the parish office for more details and payment plans.',
      category: 'events',
      author: 'Parish Office',
      date: '2025-05-18',
      time: '2:15 PM',
      priority: 'medium',
      pinned: true,
      hasAttachment: true,
      attachmentName: 'pilgrimage-details.pdf'
    },
    {
      id: 3,
      title: 'Weekly Bulletin - May 22, 2025',
      content: 'This week\'s parish bulletin includes upcoming events, prayer intentions, society meetings, and important parish announcements. Please take a copy after Mass or download the digital version.',
      category: 'bulletin',
      author: 'Parish Secretary',
      date: '2025-05-22',
      time: '8:00 AM',
      priority: 'normal',
      pinned: false,
      hasAttachment: true,
      attachmentName: 'weekly-bulletin-may-22.pdf'
    },
    {
      id: 4,
      title: 'St. Vincent de Paul Society Food Drive Success',
      content: 'Thank you to everyone who contributed to our recent food drive! We collected over 500 items which will benefit 45 families in our community. Your generosity reflects the true spirit of Christian charity.',
      category: 'gratitude',
      author: 'St. Vincent de Paul Society',
      date: '2025-05-17',
      time: '4:45 PM',
      priority: 'normal',
      pinned: false,
      hasAttachment: false
    },
    {
      id: 5,
      title: 'Youth Ministry Summer Camp Registration',
      content: 'Registration is now open for our annual Youth Summer Camp (July 10-17). This year\'s theme is "Walking in Faith." Camp includes spiritual activities, team building, and recreational programs. Ages 13-18 welcome.',
      category: 'youth',
      author: 'Youth Ministry Team',
      date: '2025-05-15',
      time: '11:20 AM',
      priority: 'medium',
      pinned: false,
      hasAttachment: true,
      attachmentName: 'youth-camp-registration.pdf'
    },
    {
      id: 6,
      title: 'Parish Building Fund Update',
      content: 'We\'re pleased to announce that our building fund has reached 75% of our target! Thank you for your continued support. The new parish center construction will begin in August 2025.',
      category: 'finance',
      author: 'Parish Finance Committee',
      date: '2025-05-12',
      time: '9:30 AM',
      priority: 'normal',
      pinned: false,
      hasAttachment: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All News', count: announcements.length },
    { id: 'important', name: 'Important', count: announcements.filter(a => a.category === 'important').length },
    { id: 'events', name: 'Events', count: announcements.filter(a => a.category === 'events').length },
    { id: 'bulletin', name: 'Bulletins', count: announcements.filter(a => a.category === 'bulletin').length },
    { id: 'youth', name: 'Youth', count: announcements.filter(a => a.category === 'youth').length }
  ];

  const filteredAnnouncements = activeTab === 'all' 
    ? announcements 
    : announcements.filter(announcement => announcement.category === activeTab);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'important': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'events': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'bulletin': return <Volume2 className="w-5 h-5 text-green-500" />;
      case 'youth': return <User className="w-5 h-5 text-purple-500" />;
      case 'gratitude': return <Bell className="w-5 h-5 text-pink-500" />;
      case 'finance': return <ArrowRight className="w-5 h-5 text-indigo-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <Bell className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Parish News & Announcements</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest updates, events, and important information from our parish community
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === category.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
              {category.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === category.id ? 'bg-white text-red-600' : 'bg-gray-300 text-gray-600'
                }`}>
                  {category.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        <div className="space-y-6 mb-12">
          {filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${getPriorityColor(announcement.priority)}`}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    {announcement.pinned && (
                      <Pin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-grow">
                      <div className="flex items-center space-x-3 mb-2">
                        {getCategoryIcon(announcement.category)}
                        <h3 className="text-2xl font-bold text-gray-800">{announcement.title}</h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{announcement.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(announcement.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{announcement.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {announcement.priority === 'high' && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Important
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {announcement.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {announcement.hasAttachment && (
                      <button className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {announcement.attachmentName || 'Download Attachment'}
                        </span>
                      </button>
                    )}
                  </div>
                  
                  <button className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <Bell className="w-16 h-16 mx-auto mb-6 text-white" />
            <h3 className="text-3xl font-bold mb-4">Never Miss an Update!</h3>
            <p className="text-xl text-red-100 mb-8">
              Subscribe to our newsletter and get the latest parish news delivered directly to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
            <p className="text-sm text-red-200 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Archive Link */}
        <div className="text-center mt-12">
          <button className="bg-gray-100 text-gray-800 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center mx-auto">
            View All Announcements Archive
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsAnnouncements;