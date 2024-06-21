import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import NavBar from './components/NavBar.tsx';
import Profile from './pages/Profile.tsx';
import VisaStatusManagement from './pages/VisaStatusManagement.tsx';
import Housing from './pages/Housing.tsx';

import './App.css'

function App() {
  return (
    <Router>
      <NavBar/>

      <Routes>
        <Route path="/employee" element={<Navigate to="/employee/profile" replace />} />
        <Route path="/employee/profile" element={<Profile />} />
        <Route path="/employee/visa" element={<VisaStatusManagement />} />
        <Route path="/employee/housing" element={<Housing />} />
      </Routes>
    </Router>
  )
}

export default App
