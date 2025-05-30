import React from 'react';
import { BookOpen } from 'lucide-react';

const LiturgicalCalendar = () => {
  return (
    <section className="py-16 px-4 fade-in opacity-0 transition-opacity duration-1000">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8 text-primary">Liturgical Calendar Highlights</h2>
        <div className=" text-black p-8 rounded-lg">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-secondary" />
          <h3 className="text-2xl font-semibold mb-4">Upcoming: Pentecost Sunday</h3>
          <p className="text-lg mb-4">June 8, 2025</p>
          <p className="max-w-2xl mx-auto">
            Celebrate the coming of the Holy Spirit with special liturgies and a parish celebration.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LiturgicalCalendar;