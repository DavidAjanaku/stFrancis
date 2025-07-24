import React, { useState, useEffect } from 'react';

const AboutSection = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://stfrancis-52b1.onrender.com/api/about-section');
        console.log('API Response:', response);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        console.log('API Data:', data);
        setAboutData(data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 px-4 bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-red-900 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-amber-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-900/20 border-t-red-900 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-red-900/10 animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-4">Loading Our Story</h2>
          <p className="text-lg text-stone-700 mb-2">Gathering parish information...</p>
          <div className="inline-flex items-center px-4 py-2 bg-white/60 rounded-full text-sm text-stone-600 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Connected to: localhost:5001
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-20 px-4 bg-gradient-to-br from-red-50 via-stone-50 to-red-100 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-red-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-red-800 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-red-900 mb-4">Connection Issue</h2>
          <p className="text-lg text-stone-700 mb-6">We're having trouble loading the about section</p>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-red-200">
            <p className="text-red-700 font-medium mb-2">Error Details:</p>
            <p className="text-sm text-stone-600 font-mono bg-stone-100 p-3 rounded">{error}</p>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="group relative inline-flex items-center px-8 py-3 bg-gradient-to-r from-red-900 to-red-800 text-white font-semibold rounded-lg shadow-lg hover:from-red-800 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-red-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-amber-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-600 rounded-full blur-3xl"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-3 h-3 bg-red-900 rounded-full opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-amber-600 rounded-full opacity-40"></div>
      <div className="absolute top-1/3 left-10 w-1 h-1 bg-emerald-600 rounded-full opacity-50"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Section */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-red-900/10 rounded-full text-red-900 text-sm font-medium">
                <div className="w-2 h-2 bg-red-900 rounded-full mr-2"></div>
                Our Story
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold text-red-900 leading-tight">
                About Our
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-800">
                  Parish
                </span>
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <p className="text-xl text-stone-700 leading-relaxed font-light">
                {aboutData?.mainDescription || 'No description available'}
              </p>
              
              {/* Additional decorative elements */}
              <div className="flex items-center space-x-4">
                <div className="h-px flex-1 bg-gradient-to-r from-red-900/20 to-transparent"></div>
                <div className="w-3 h-3 bg-red-900 rounded-full"></div>
                <div className="h-px flex-1 bg-gradient-to-l from-red-900/20 to-transparent"></div>
              </div>
            </div>

            {/* Stats or additional info could go here */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-stone-200">
                <h3 className="text-2xl font-bold text-red-900 mb-2">Welcome</h3>
                <p className="text-stone-600">All are invited to join our community</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-stone-200">
                <h3 className="text-2xl font-bold text-red-900 mb-2">Faith</h3>
                <p className="text-stone-600">Growing together in spiritual journey</p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative">
            {aboutData?.image ? (
              <div className="relative group">
                {/* Background decorative elements */}
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-200 to-red-200 rounded-2xl transform rotate-3 opacity-30 group-hover:rotate-6 transition-transform duration-300"></div>
                <div className="absolute -inset-2 bg-gradient-to-br from-red-200 to-amber-200 rounded-2xl transform -rotate-2 opacity-20 group-hover:-rotate-3 transition-transform duration-300"></div>
                
                {/* Main image container */}
                <div className="relative bg-white p-2 rounded-2xl shadow-2xl">
                  <img
                    src={aboutData.image}
                    alt="Church interior"
                    className="rounded-xl w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Image overlay gradient */}
                  <div className="absolute inset-2 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
            ) : (
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-stone-200 to-stone-300 rounded-2xl transform rotate-3 opacity-30"></div>
                <div className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-stone-300 rounded-2xl w-full h-80 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-stone-500 font-medium">Image Coming Soon</p>
                  <p className="text-stone-400 text-sm">We're working on adding visual content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;