import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import StaffSalary from './pages/StaffSalary';
import Reports from './pages/Reports';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ background: '#121212', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>Loading...</div>;

  return (
    <div className="app-container">
      {user && <Sidebar />}
      <main className={user ? "main-content" : "full-content"}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/events" element={user ? <Events /> : <Navigate to="/login" />} />
          <Route path="/income" element={user ? <Income /> : <Navigate to="/login" />} />
          <Route path="/expenses" element={user ? <Expenses /> : <Navigate to="/login" />} />
          <Route path="/staff" element={user ? <StaffSalary /> : <Navigate to="/login" />} />
          <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
