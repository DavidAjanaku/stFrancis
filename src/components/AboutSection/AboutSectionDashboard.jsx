import React, { useState, useEffect } from 'react';
import { Info, Edit3, Image } from 'lucide-react';
import { SectionHeader } from '../shared/SharedComponents';
import AboutSectionEditModal from './AboutSectionEditModal';

const AboutSectionDashboard = ({ editingItem, setEditingItem }) => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('https://distinct-stranger-production.up.railway.app/api/about-section');
        if (!response.ok) throw new Error('Failed to fetch about section data');
        const data = await response.json();
        setAboutData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

const handleSaveAboutSection = async (updatedData) => {
  try {
    const response = await fetch('https://distinct-stranger-production.up.railway.app/api/about-section', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      // Try to get the error message from the response
      const errorResponse = await response.json();
      const errorMsg = errorResponse.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMsg);
    }

    const savedData = await response.json();
    setAboutData(savedData);
    setEditingItem(null);
  } catch (err) {
    console.error('Save error details:', {
      message: err.message,
      stack: err.stack
    });
    alert(`Save failed: ${err.message}`);
  }
};

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading about section...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <SectionHeader
          title="About Our Parish"
          icon={Info}
          buttonIcon={Edit3}
          buttonText="Edit About Section"
          onButtonClick={() => setEditingItem('about-section')}
        />
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg text-red-600 mb-2">Error Loading About Section</p>
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
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <SectionHeader
          title="About Our Parish"
          icon={Info}
          buttonIcon={Edit3}
          buttonText="Edit About Section"
          onButtonClick={() => setEditingItem('about-section')}
        />
        
        <div className="space-y-6">
          {/* Text and Image Preview */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About Text</h3>
                <p className="text-gray-700 leading-relaxed">
                  {aboutData.mainDescription}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <Image className="w-5 h-5 mr-2 text-green-600" />
                Parish Image
              </h3>
              <div className="bg-green-50 p-4 rounded-lg">
                {aboutData.image ? (
                  <div className="relative">
                    <img
                      src={aboutData.image}
                      alt="Parish"
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute top-2 right-2 bg-white bg-opacity-80 px-2 py-1 rounded text-xs text-gray-600">
                      Current Image
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Image className="w-12 h-12 mx-auto mb-2" />
                      <p>No image uploaded</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AboutSectionEditModal
        isOpen={editingItem === 'about-section'}
        onClose={() => setEditingItem(null)}
        data={aboutData}
        onSave={handleSaveAboutSection}
      />
    </>
  );
};

export default AboutSectionDashboard;