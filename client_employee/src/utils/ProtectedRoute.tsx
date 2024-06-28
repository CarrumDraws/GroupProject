import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, onboardingData } = useOnboarding();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (onboardingData?.status === 'Approved' && window.location.pathname == '/onboarding') {
    return <Navigate to="/profile" replace />;
  }

  if (onboardingData?.status !== 'Approved' && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }



  return <>{children}</>;
};

export default ProtectedRoute;