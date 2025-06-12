// components/AboutSection/AboutSection.js
import React from 'react';
import { Info, Edit3, Image, Users, Heart, Calendar } from 'lucide-react';
import { SectionHeader } from '../shared/SharedComponents';
import AboutSectionEditModal from './AboutSectionEditModal';

const AboutSection = ({ data, setData, editingItem, setEditingItem }) => {
  const handleSaveAboutSection = (updatedData) => {
    setData(updatedData);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
  };

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
          {/* Parish Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Parish Information
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <div>
                    <span className="font-medium text-blue-800">Parish Name:</span>
                    <p className="text-blue-700">{data.aboutSection?.parishName || 'St. Mary\'s Parish'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Established:</span>
                    <p className="text-blue-700">{data.aboutSection?.established || '1948'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Years of Service:</span>
                    <p className="text-blue-700">{data.aboutSection?.yearsOfService || '75+ years'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-600" />
                  Mission Statement
                </h3>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700 leading-relaxed">
                    {data.aboutSection?.mission || 
                      'Our mission is to be a welcoming community where all people can encounter Jesus Christ, grow in faith, and serve others with love and compassion.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <Image className="w-5 h-5 mr-2 text-green-600" />
                Parish Image
              </h3>
              <div className="bg-green-50 p-4 rounded-lg">
                {data.aboutSection?.image ? (
                  <div className="relative">
                    <img
                      src={data.aboutSection.image}
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

          {/* Parish Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <Info className="w-5 h-5 mr-2 text-purple-600" />
              Parish Description
            </h3>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-purple-800">Main Description:</span>
                  <p className="text-purple-700 leading-relaxed mt-1">
                    {data.aboutSection?.mainDescription || 
                      'St. Mary\'s Parish has been serving our community for over 75 years. We are a vibrant Catholic community committed to spreading the Gospel through worship, service, and fellowship.'
                    }
                  </p>
                </div>
                
                {data.aboutSection?.additionalDescription && (
                  <div>
                    <span className="font-medium text-purple-800">Additional Information:</span>
                    <p className="text-purple-700 leading-relaxed mt-1">
                      {data.aboutSection.additionalDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Parish Statistics */}
          {data.aboutSection?.statistics && data.aboutSection.statistics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-amber-600" />
                Parish Statistics
              </h3>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.aboutSection.statistics.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-amber-800">{stat.value}</div>
                      <div className="text-amber-600 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-red-50 to-blue-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Learn More Button</h4>
                <p className="text-gray-600 text-sm">
                  Button Text: {data.aboutSection?.buttonText || 'Learn More About Us'}
                </p>
                <p className="text-gray-600 text-sm">
                  Button Link: {data.aboutSection?.buttonLink || '/about'}
                </p>
              </div>
              <button className="bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors text-sm">
                {data.aboutSection?.buttonText || 'Learn More About Us'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AboutSectionEditModal
        isOpen={editingItem === 'about-section'}
        onClose={handleCloseModal}
        data={data}
        onSave={handleSaveAboutSection}
      />
    </>
  );
};

export default AboutSection;