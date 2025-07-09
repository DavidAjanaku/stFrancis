import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard/Dashboard';
import HomepageAdmin from '../components/Homepage/Homepage';
import MassSchedule from '../components/MassSchedule/MassSchedule';
import AboutSection from '../components/AboutSection/AboutSectionDashboard';
import Ministries from '../components/MinistriesManagement/Ministries';
import Events from '../components/EventManagement/EventAdmin';
import PrayerRequests from '../components/ContactPrayerManagement/ContactPrayerAdmin';
import Gallery from '../components/GalleryManagement/GalleryManagement';
import { dashboardData } from '../Dashboard/data/dashboardData';
import { menuItems } from '../Dashboard/data/menuItems';
import DonationAdmin from '../components/Dashboard/Post/Post';
import LiturgicalCalendarAdmin from './LiturgicalCalendarAdmin/LiturgicalCalendarAdmin';
import ContactAdmin from '../components/Dashboard/ContactAdmin/ContactAdmin';
import FooterAdmin from '../components/Dashboard/FooterAdmin/FooterAdmin';

const ChurchAdminDashboard = ({ data, onSaveMassSchedule, handleLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [localData, setLocalData] = useState({ ...dashboardData, ...data });

  const renderContent = () => {
    const commonProps = {
      data: localData,
      setData: setLocalData,
      editingItem,
      setEditingItem
    };

    switch (activeSection) {
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      case 'homepage':
        return <HomepageAdmin {...commonProps} />;
      case 'mass-schedule':
        return <MassSchedule 
          {...commonProps} 
          onSaveMassSchedule={onSaveMassSchedule} 
        />;
      case 'about-us':
        return <AboutSection {...commonProps} />;
      case 'ministries':
        return <Ministries {...commonProps} />;
      case 'events':
        return <Events {...commonProps} />;
      case 'prayer-requests':
        return <PrayerRequests {...commonProps} />;
      case 'post':
        return <DonationAdmin {...commonProps} />;
      case 'liturgical':
        return <LiturgicalCalendarAdmin {...commonProps} />;  
      case 'contact':
        return <ContactAdmin {...commonProps} />;  
      case 'gallery':
        return <Gallery {...commonProps} />;
          case 'footer':
        return <FooterAdmin {...commonProps} />;
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
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