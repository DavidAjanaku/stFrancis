import React from 'react';
import { Users, Music, Heart, ChevronRight } from 'lucide-react';

const MinistriesSection = () => {
  const ministries = [
    {
      icon: Users,
      title: 'Youth Group',
      description: 'Engaging activities and faith formation for teenagers and young adults.',
      action: 'Learn More'
    },
    {
      icon: Music,
      title: 'Parish Choir',
      description: 'Lift your voice in praise and worship with our talented choir ministry.',
      action: 'Join Us'
    },
    {
      icon: Heart,
      title: 'Outreach Ministry',
      description: 'Serving the community through food drives, charity work, and volunteer efforts.',
      action: 'Get Involved'
    }
  ];

  return (
    <section className="py-16 px-4 fade-in opacity-0 transition-opacity duration-1000">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">Parish Ministries</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {ministries.map((ministry, index) => (
            <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <ministry.icon className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-4">{ministry.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {ministry.description}
              </p>
              <button className="text-primary hover:text-purple-700 font-semibold flex items-center mx-auto">
                {ministry.action} <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MinistriesSection;