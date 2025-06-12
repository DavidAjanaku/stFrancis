// components/shared/SharedComponents.js
import React from 'react';
import { X } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <Icon className="h-8 w-8 text-gray-400" />
    </div>
  </div>
);

export const EditModal = ({ title, children, onSave, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
      <div className="flex justify-end gap-2 p-4 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

export const SectionHeader = ({ title, buttonText, onButtonClick, children }) => (
  <div className="flex items-center justify-between">
    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
    <div className="flex items-center gap-4">
      {children}
      {buttonText && onButtonClick && (
        <button 
          onClick={onButtonClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {buttonText}
        </button>
      )}
    </div>
  </div>
);