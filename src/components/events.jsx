import React from 'react';
import { Calendar } from 'lucide-react';

const EventsSection = () => {
  const events = [
    {
      date: 'June 15, 2025',
      title: 'Parish Picnic',
      description: 'Join us for our annual parish picnic with food, games, and fellowship for the whole family.'
    },
    {
      date: 'June 22, 2025',
      title: 'Youth Retreat',
      description: 'A weekend retreat for young adults focusing on faith, friendship, and personal growth.'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800 fade-in opacity-0 transition-opacity duration-1000">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">Upcoming Events</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-primary mr-2" />
                <span className="text-sm text-gray-500">{event.date}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;