// App.js
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../navigation/header';
import LoginForm from '../components/LoginForm';
import Dashboard from '../components/Dashboard/Dashboard';
import Homepage from '../components/Homepage/Homepage';
import MassSchedule from '../components/MassSchedule/MassSchedule';
import AboutSection from '../components/AboutSection/AboutSectionDashboard';
import Ministries from '../components/Ministries';
import Events from '../components/EventManagement/EventAdmin';
import PrayerRequests from '../components/ContactPrayerManagement/ContactPrayerAdmin';
import Gallery from '../components/GalleryManagement/GalleryManagement';
import { dashboardData } from '../Dashboard/data/dashboardData';
import { menuItems } from '../Dashboard/data/menuItems';

const ChurchAdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [data, setData] = useState(dashboardData);

  const renderContent = () => {
    const commonProps = {
      data,
      setData,
      editingItem,
      setEditingItem
    };

    switch (activeSection) {
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      case 'homepage':
        return <Homepage {...commonProps} />;
      case 'mass-schedule':
        return <MassSchedule {...commonProps} />;
      case 'about-us':
        return <AboutSection {...commonProps} />;
      case 'ministries':
        return <Ministries {...commonProps} />;
      case 'events':
        return <Events {...commonProps} />;
      case 'prayer-requests':
        return <PrayerRequests {...commonProps} />;
      case 'gallery':
        return <Gallery {...commonProps} />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {menuItems.find(item => item.id === activeSection)?.label || 'Section'}
            </h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ChurchAdminDashboard;