import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './utils/ProtectedRoute.tsx';
import NavBar from './components/NavBar.tsx';
import Profile from './pages/Profile.tsx';
import VisaStatusManagement from './pages/VisaStatusManagement.tsx';
import Housing from './pages/Housing.tsx';
import Registration from './pages/Registration.tsx';
import Login from './pages/Login.tsx';
import Onboarding from './pages/Onboarding.tsx';
import { ProfileProvider } from './context/ProfileContext.tsx';

import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState<string>('Not Started');

  useEffect(() => {
    const checkLoggedIn = () => {
      const token = localStorage.getItem('token');
      if(token) {
        setIsLoggedIn(true);
      }else {
        setIsLoggedIn(false);
      }
    }

    checkLoggedIn();
  }, []);

  useEffect(() => {
    // fetch onboarding status from backend and set onboarding status function
    
    if(isLoggedIn) {
      // call function
    }
  }, [isLoggedIn]);

  return (
    <Router>
      {isLoggedIn && <NavBar />}
      <Routes>
        <Route path='/' element={
          isLoggedIn ?
            <Navigate to={onboardingStatus !== 'Approved' ? '/onboarding' : '/profile'} replace /> :
            <Navigate to='/login' replace />
          }
        />

        <Route path='/login' element={<Login onboardingStatus={onboardingStatus} />} />
        <Route path='/register/:token' element={<Registration />} />

        {isLoggedIn && (
          <>
            <Route path="/profile" element={
              <ProtectedRoute isLoggedIn={isLoggedIn} onboardingStatus={onboardingStatus}>
                <ProfileProvider>
                  <Profile />
                </ProfileProvider>
              </ProtectedRoute>
            } />
            <Route path="/visa" element={
              <ProtectedRoute isLoggedIn={isLoggedIn} onboardingStatus={onboardingStatus}>
                <VisaStatusManagement />
              </ProtectedRoute>
            } />
            <Route path="/housing" element={
              <ProtectedRoute isLoggedIn={isLoggedIn} onboardingStatus={onboardingStatus}>
                <Housing />
              </ProtectedRoute>
            } />
            <Route path='/onboarding' element={<Onboarding initialStatus={onboardingStatus} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
