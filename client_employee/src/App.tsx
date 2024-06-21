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
        <Route path="/" element={<Navigate to="/profile" replace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/visa" element={<VisaStatusManagement />} />
        <Route path="/housing" element={<Housing />} />
      </Routes>
    </Router>
  )
}

export default App
