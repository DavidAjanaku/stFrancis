import React, { useState, useEffect } from 'react';

const DonationPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [donationCategories, setDonationCategories] = useState([]);
  const [heroContent, setHeroContent] = useState({
    title: 'Your Donations Keep The',
    titleHighlight: 'Candles Lit',
    paragraph1: 'The Parish appreciates our donors for your many support in cash or kind.',
    paragraph2: 'With these contributions, we keep the activities of the parish going.',
    paragraph3: 'May the Lord bless your silent contributions, answer your private intentions, and meet',
    paragraph4: 'you at every point of your need. Amen!',
    buttonText: 'DONATE TO A CAUSE BELOW',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch donation categories
        const categoriesResponse = await fetch('https://distinct-stranger-production.up.railway.app/api/donations-sections/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch donation categories');
        const categoriesData = await categoriesResponse.json();
        console.log(categoriesData);
        
        setDonationCategories(categoriesData);

        // Fetch hero content
        const heroResponse = await fetch('https://distinct-stranger-production.up.railway.app/api/donations-sections/hero');
        if (!heroResponse.ok) throw new Error('Failed to fetch hero content');
        const heroData = await response.json();
        setHeroContent(heroData);
      } catch (err) {
        setError('Failed to load donation data. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here if desired
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading donation page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg text-red-600 mb-2">Error Loading Donation Page</p>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 overflow-hidden">
        {/* Background candle effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-orange-300 rounded-full opacity-30 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-yellow-400 rounded-full opacity-25 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-20 w-36 h-36 bg-amber-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-orange-400 rounded-full opacity-30 blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        {/* Floating particles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-300 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-32 right-24 w-1 h-1 bg-orange-300 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-24 left-32 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '2s' }}></div>

        {/* Main content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            {heroContent.title}
            <span className="block text-yellow-300">{heroContent.titleHighlight}</span>
          </h1>

          <div className="space-y-6 text-white text-lg md:text-xl leading-relaxed mb-12">
            <p>{heroContent.paragraph1}</p>
            <p>{heroContent.paragraph2}</p>
            <p>{heroContent.paragraph3}</p>
            <p>{heroContent.paragraph4}</p>
          </div>

          <button
            onClick={() => document.getElementById('donation-section').scrollIntoView({ behavior: 'smooth' })}
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-lg rounded-full shadow-2xl hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10">{heroContent.buttonText}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </section>

      {/* Donation Categories Section */}
      <section id="donation-section" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">Donation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select from our various donation categories to support the parish activities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {donationCategories.map((category) => (
              <div
                key={category._id}
                className={`relative rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 ${
                  category.theme === 'brown'
                    ? 'bg-gradient-to-br from-amber-100 to-yellow-50 border-2 border-amber-200'
                    : category.theme === 'harvest'
                    ? 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200'
                    : 'bg-gradient-to-br from-blue-50 to-gray-50 border-2 border-blue-200'
                } ${hoveredCard === category._id ? 'shadow-2xl' : ''}`}
                onMouseEnter={() => setHoveredCard(category._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  {category.image ? (
                    <img
                      src={`https://distinct-stranger-production.up.railway.app${category.image}`}
                      alt={category.title}
                      className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <div className="text-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-gray-400 text-sm">No image available</span>
                      </div>
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      category.theme === 'brown'
                        ? 'from-amber-900/60 to-transparent'
                        : category.theme === 'harvest'
                        ? 'from-orange-900/60 to-transparent'
                        : 'from-blue-900/60 to-transparent'
                    }`}
                  ></div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3
                    className={`text-2xl font-bold mb-6 text-center ${
                      category.theme === 'brown'
                        ? 'text-amber-800'
                        : category.theme === 'harvest'
                        ? 'text-orange-700'
                        : 'text-blue-700'
                    }`}
                  >
                    {category.title}
                  </h3>

                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-gray-600 font-medium mb-2">Account Details</p>
                      <p className="text-gray-800 font-semibold text-lg">{category.accountName}</p>
                    </div>

                    <div
                      className={`rounded-lg p-4 space-y-3 ${
                        category.theme === 'brown'
                          ? 'bg-amber-50 border border-amber-200'
                          : category.theme === 'harvest'
                          ? 'bg-orange-50 border border-orange-200'
                          : 'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Bank:</span>
                        <span className="font-semibold text-gray-800">{category.bankName}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Account Number:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-semibold text-gray-800">{category.accountNumber}</span>
                          <button
                            onClick={() => copyToClipboard(category.accountNumber)}
                            className={`p-1 text-gray-500 transition-colors ${
                              category.theme === 'brown'
                                ? 'hover:text-amber-700'
                                : category.theme === 'harvest'
                                ? 'hover:text-orange-700'
                                : 'hover:text-blue-700'
                            }`}
                            title="Copy to clipboard"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(category.accountNumber)}
                      className={`w-full font-semibold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg ${
                        category.theme === 'brown'
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800'
                          : category.theme === 'harvest'
                          ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                      }`}
                    >
                      Copy Account Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Thank You for Your Generosity</h3>
          <p className="text-gray-300 leading-relaxed">
            Your donations help us continue our mission and serve the community.
            May God bless your generous hearts and multiply your blessings.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DonationPage;