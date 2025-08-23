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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    // Enhanced authentication check with better error handling
    const checkAuthentication = async () => {
      try {
        // Add a small delay to ensure localStorage is fully available
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const token = localStorage.getItem('token');
        console.log('Authentication check - token found:', !!token);
        console.log('Token value:', token);
        
        const authStatus = token === 'demo-token';
        setIsAuthenticated(authStatus);
        console.log('Authentication status set to:', authStatus);
        
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        console.log('Loading state set to false');
      }
    };

    // Fetch mass schedule data
    const fetchMassSchedule = async () => {
      try {
        const response = await fetch('/api/mass-schedule');
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

    checkAuthentication();
    fetchMassSchedule();
  }, []);

  const handleLogin = () => {
    try {
      localStorage.setItem('token', 'demo-token');
      setIsAuthenticated(true);
      console.log('Login successful, auth state updated');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      console.log('Logout successful, auth state updated');
    } catch (error) {
      console.error('Logout failed:', error);
    }
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

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          {/* <p className="text-gray-600">Loading application...</p> */}
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
          <Route path="/parish-groups/societies" element={<ParishSocietiesPage />} />
          
          {/* Login route */}
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
          
          {/* Protected admin route */}
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
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;