import React from 'react';

const DonationSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className=" rounded-lg  overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 relative">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Child in need of healthcare support"
                className="w-full h-80 lg:h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="absolute bottom-6 left-6">
                <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md font-semibold transition-colors duration-200 shadow-lg">
                  DONATE NOW
                </button>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                Healthcare, food for marginalized children
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Every child deserves access to basic healthcare and nutritious food. Your support helps us provide essential medical care, nutritious meals, and hope to children in underserved communities. Together, we can make a lasting difference in their lives and give them the foundation they need to thrive.
              </p>
              
           
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;