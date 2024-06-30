import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./utils/ProtectedRoute";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
import VisaStatusManagement from "./pages/VisaStatusManagement";
import Housing from "./pages/Housing";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import { OnboardingProvider, useOnboarding } from "./context/OnboardingContext";

import "./App.css";

function App() {
  return (
    <Router>
      <OnboardingProvider>
        <MainRoutes />
      </OnboardingProvider>
    </Router>
  );
}

function MainRoutes() {
  const { isLoggedIn, onboardingData } = useOnboarding();

  return (
    <>
      {isLoggedIn && <NavBar />}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate
                to={
                  onboardingData?.status !== "Accept"
                    ? "/onboarding"
                    : "/profile"
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login onboardingStatus={onboardingData?.status} />
            ) : (
              <Navigate
                to={
                  onboardingData?.status !== "Accept"
                    ? "/onboarding"
                    : "/profile"
                }
                replace
              />
            )
          }
        />
        <Route path="/register/:token" element={<Registration />} />

        {isLoggedIn && (
          <>
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/visa"
              element={
                <ProtectedRoute>
                  <VisaStatusManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/housing"
              element={
                <ProtectedRoute>
                  <Housing />
                </ProtectedRoute>
              }
            />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
