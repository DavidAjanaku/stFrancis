// components/Homepage/Homepage.js
import React from 'react';
import { Edit3 } from 'lucide-react';
import { EditModal, SectionHeader } from '../shared/SharedComponents';

const Homepage = ({ data, editingItem, setEditingItem }) => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Homepage Settings"
        buttonText={
          <>
            <Edit3 className="h-4 w-4" />
            Edit Homepage
          </>
        }
        onButtonClick={() => setEditingItem('homepage')}
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Current Homepage Content</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded">{data.homepage.welcomeMessage}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded">{data.homepage.heroSubtitle}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
            <img src={data.homepage.backgroundImage} alt="Hero background" className="w-full h-48 object-cover rounded" />
          </div>
        </div>
      </div>

      {editingItem === 'homepage' && (
        <EditModal
          title="Edit Homepage Content"
          onSave={() => setEditingItem(null)}
          onCancel={() => setEditingItem(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
              <input
                type="text"
                defaultValue={data.homepage.welcomeMessage}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <textarea
                defaultValue={data.homepage.heroSubtitle}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
              <input
                type="url"
                defaultValue={data.homepage.backgroundImage}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </EditModal>
      )}
    </div>
  );
};

export default Homepage;