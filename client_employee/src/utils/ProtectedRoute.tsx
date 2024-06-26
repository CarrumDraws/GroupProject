import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  onboardingStatus: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isLoggedIn, onboardingStatus, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (onboardingStatus !== 'Approved') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;