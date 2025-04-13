// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';  // Import Navbar
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <Router>
      <Navbar />  {/* Render the Navbar */}
      <Routes>
        <Route path="/reports" element={<ReportList />} />
        <Route path="/submit-report" element={<ReportForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ReportList />} />  {/* Default route */}
      </Routes>
    </Router>
  );
};

export default App;
