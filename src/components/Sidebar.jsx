// components/Sidebar.js
import React from 'react';
import { Church, Menu, LogOut } from 'lucide-react';
import { menuItems } from '../Dashboard/data/menuItems';

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
  setIsAuthenticated
}) => {
  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 relative flex flex-col h-full`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <Church className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Church Admin</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation - takes up remaining space */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out Button - Always at bottom */}
      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={() => setIsAuthenticated(false)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
            sidebarOpen 
              ? 'text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-sm' 
              : 'text-red-600 hover:bg-red-50 justify-center'
          }`}
          title={!sidebarOpen ? 'Sign Out' : ''}
        >
          <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
          {sidebarOpen && (
            <span className="font-medium">Sign Out</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;