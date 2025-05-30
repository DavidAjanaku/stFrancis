import React from 'react';
import { Users, Video, Phone, Calendar, Heart, BookOpen } from 'lucide-react';

const QuickActionButtons = () => {
  const quickActions = [
    {
      title: 'Join a Society',
      description: 'Become part of our faith community',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
      link: '/societies'
    },
    {
      title: 'Watch Live Mass',
      description: 'Join us online for Holy Mass',
      icon: Video,
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50',
      link: '/watch-live'
    },
    {
      title: 'Contact Us',
      description: 'Get in touch with our parish',
      icon: Phone,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
      link: '/contact'
    },
    {
      title: 'View Events',
      description: 'See upcoming parish activities',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50',
      link: '/events'
    },
    {
      title: 'Prayer Requests',
      description: 'Submit your prayer intentions',
      icon: Heart,
      color: 'bg-pink-500 hover:bg-pink-600',
      textColor: 'text-pink-600',
      bgLight: 'bg-pink-50',
      link: '/prayer-requests'
    },
    {
      title: 'Daily Readings',
      description: 'Read today\'s Gospel and reflections',
      icon: BookOpen,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      textColor: 'text-indigo-600',
      bgLight: 'bg-indigo-50',
      link: '/readings'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Quick Access</h2>
        <p className="text-xl text-gray-600">Everything you need at your fingertips</p>
      </div>

      {/* Quick Action Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => {
                // Handle navigation - you can replace this with your routing logic
                console.log(`Navigate to: ${action.link}`);
              }}
            >
              <div className="p-8">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${action.bgLight} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-8 h-8 ${action.textColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900">
                  {action.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {action.description}
                </p>

                {/* Action Button */}
                <button className={`w-full py-3 px-6 rounded-xl text-white font-semibold ${action.color} transition-all duration-300 transform group-hover:scale-105`}>
                  Get Started
                </button>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${action.color.replace('bg-', 'border-2 border-')} pointer-events-none`}></div>
            </div>
          );
        })}
      </div>

      {/* Featured Action - Larger Call-to-Action */}
      <div className="mt-16 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 text-center text-white shadow-2xl">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold mb-4">Need Spiritual Guidance?</h3>
          <p className="text-xl text-red-100 mb-8">
            Our priests and pastoral team are here to support you on your faith journey. 
            Whether you need counseling, confession, or just someone to talk to.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors transform hover:scale-105">
              Schedule Appointment
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-red-600 transition-all transform hover:scale-105">
              Call Now
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="mt-8 text-center p-6 bg-gray-50 rounded-2xl">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Emergency or Urgent Spiritual Need?</h4>
        <p className="text-gray-600 mb-4">For last rites, emergency confession, or urgent pastoral care</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="tel:+234-XXX-XXX-XXXX" 
            className="inline-flex items-center justify-center bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            <Phone className="w-4 h-4 mr-2" />
            Emergency Hotline
          </a>
          <a 
            href="https://wa.me/234XXXXXXXXXX" 
            className="inline-flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            📱 WhatsApp 24/7
          </a>
        </div>
      </div>
    </div>
  );
};

export default QuickActionButtons;