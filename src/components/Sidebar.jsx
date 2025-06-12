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
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300`}>
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
      
      <nav className="p-4">
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
      
      {sidebarOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;