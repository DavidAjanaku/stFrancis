import React from 'react';
import { Church, Menu, LogOut } from 'lucide-react';
import { menuItems } from '../Dashboard/data/menuItems';

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
  handleLogout
}) => {
  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-amber-50 shadow-xl transition-all duration-300 h-full flex flex-col border-r border-amber-200`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-amber-200 bg-gradient-to-r from-amber-800 to-amber-900 text-white min-h-[72px]">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <Church className="h-8 w-8 text-white" />
            <span className="text-xl font-bold">Church Admin</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-amber-700 rounded-lg transition-colors"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative ${
                    activeSection === item.id
                      ? 'bg-amber-100 text-amber-800 border-r-4 border-amber-700 shadow-sm'
                      : 'text-amber-700 hover:bg-amber-100 hover:text-amber-900'
                  }`}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${
                    activeSection === item.id ? 'text-amber-800' : ''
                  }`} />
                  {sidebarOpen && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                  {/* Tooltip for collapsed state */}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-amber-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-amber-200 bg-amber-100 mt-auto">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative ${
            sidebarOpen
              ? 'text-red-700 hover:bg-red-100 hover:text-red-800 hover:shadow-sm'
              : 'text-red-700 hover:bg-red-100 justify-center'
          }`}
          title={!sidebarOpen ? 'Sign Out' : ''}
        >
          <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
          {sidebarOpen && (
            <span className="font-medium">Sign Out</span>
          )}
          {/* Tooltip for collapsed state */}
          {!sidebarOpen && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-amber-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;