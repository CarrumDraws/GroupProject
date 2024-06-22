import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store/store.tsx';
import NavBar from './components/NavBar.tsx';
import Profile from './pages/Profile.tsx';
import VisaStatusManagement from './pages/VisaStatusManagement.tsx';
import Housing from './pages/Housing.tsx';
import Registration from './pages/Registration.tsx';
import Login from './pages/Login.tsx';

import './App.css'

function App() {
  return (
    <Provider store={store}>
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/profile' replace/>} />
        
        <Route
          path="/profile"
          element={
            <div>
              <NavBar />
              <Profile />
            </div>
          }
        />
        <Route
          path="/visa"
          element={
            <div>
              <NavBar />
              <VisaStatusManagement />
            </div>
          }
        />
        <Route
          path="/housing"
          element={
            <div>
              <NavBar />
              <Housing />
            </div>
          }
        />

        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </Provider>
  );
}

export default App;
