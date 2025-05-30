import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-16 px-4 bg-stone-50 fade-in opacity-0 transition-opacity duration-1000">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-red-900">About Our Parish</h2>
            <p className="text-lg mb-6 text-stone-700 leading-relaxed">
              St. Mary's Parish has been serving our community for over 75 years. We are a vibrant Catholic community
              committed to spreading the Gospel through worship, service, and fellowship.
            </p>
            <p className="text-lg mb-6 text-stone-700 leading-relaxed">
              Our mission is to be a welcoming community where all people can encounter Jesus Christ, grow in faith,
              and serve others with love and compassion.
            </p>
            <button className="bg-red-900 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors shadow-sm font-semibold">
              Learn More About Us
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-emerald-100 rounded-lg transform rotate-2 opacity-20"></div>
            <img
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhp52IA1XRr5vh0SYI9pzQ1cFtdzZL1xVgFBuyyqqQQfOQEe0Y_nljoRn1ddPtoMBmnRfWSxEO31IYHjSX2eEmBQKZY5cILDPivK5_fgVVXnwDQlZGq3eh5rmnrcr5Kf2DKby6DouXJ8NU/s1600/16832323_1364648420262936_9112539321726088012_n.jpg"
              alt="Church interior"
              className="rounded-lg shadow-lg w-full relative z-10 border-2 border-stone-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;