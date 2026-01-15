import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Noticeboard from './pages/Noticeboard';
import Recruitment from './pages/Recruitment';
import Events from './pages/Events';
import Login from './pages/Login';
import SuperAdmin from './pages/SuperAdmin';
import ClubAdmin from './pages/ClubAdmin';
import './App.css';
import './pages/Pages.css';
import './pages/Login.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Noticeboard />} />
                <Route path="/noticeboard" element={<Noticeboard />} />
                <Route path="/recruitment" element={<Recruitment />} />
                <Route path="/events" element={<Events />} />
                <Route path="/login" element={<Login />} />
                <Route path="/superadmin" element={<SuperAdmin />} />
                <Route path="/admin" element={<ClubAdmin />} />
              </Routes>
            </main>
            <ToastContainer position="bottom-right" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
