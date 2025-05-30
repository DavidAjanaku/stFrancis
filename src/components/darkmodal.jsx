import React from 'react';

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className="fixed top-20 right-4 z-40">
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-primary text-white shadow-lg hover:bg-purple-700 transition-colors"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default DarkModeToggle;