import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import React, { useEffect, useState } from 'react';
import Header from './navigation/header';
import Home from './pages/home';
import About from './components/about';
import Events from './components/events';
import Blog from './components/post';
import Contact from './components/contactPrayer';
import ChurchAdminDashboard from './Dashboard/ChurchAdminDashboard';
import LoginForm from './components/LoginForm';
import DonationPage from './components/DonationPage/DonationPage';
import PhotoGallery from './components/PhotoGallery';
import ParishSocietiesPage from './components/ParishSocietiesApp/ParishSocietiesApp';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    massSchedule: {
      sunday: [],
      weekday: [],
      confession: [],
      specialEvents: []
    }
  });

  useEffect(() => {
    // Simplified authentication check using localStorage
    const token = localStorage.getItem('token');
    setIsAuthenticated(token === 'demo-token');
    setIsLoading(false);

    // Fetch mass schedule data
    const fetchMassSchedule = async () => {
      try {
        const response = await fetch('api/mass-schedule');
        if (response.ok) {
          const scheduleData = await response.json();
          setData(prev => ({
            ...prev,
            massSchedule: scheduleData
          }));
        }
      } catch (error) {
        console.error('Failed to fetch mass schedule:', error);
      }
    };

    fetchMassSchedule();
  }, []);

  const handleLogin = () => {
    localStorage.setItem('token', 'demo-token');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Update mass schedule data in parent state
  const handleSaveMassSchedule = (newData) => {
    setData(prev => ({
      ...prev,
      massSchedule: {
        sunday: newData.massSchedule.sunday || [],
        weekday: newData.massSchedule.weekday || [],
        confession: newData.massSchedule.confession || [],
        specialEvents: newData.massSchedule.specialEvents || []
      }
    }));
  };

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
                    <Route path="/donation" element={<DonationPage />} />
                                        <Route path="/gallery" element={<PhotoGallery />} />


          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route path="/parish-groups/societies" element={<ParishSocietiesPage />} />
          <Route
            path="/admin"
            element={
              isAuthenticated ? (
                <ChurchAdminDashboard 
                  data={data} 
                  onSaveMassSchedule={handleSaveMassSchedule} 
                  handleLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;