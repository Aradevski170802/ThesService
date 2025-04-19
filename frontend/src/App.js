import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';  // Import Navbar
import ReportList from './components/ReportList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/Home';

import ReportDetails from './components/ReportDetails';  // Import ReportDetails
import ReportSubmission from './components/ReportSubmission'; // Import the ReportSubmission component
import VerifyPage from './pages/VerifyPage';  // Import the VerifyPage
import ChangePasswordPage from './pages/ChangePasswordPage';  // Import ChangePasswordPage
import ChangeEmailPage from './pages/ChangeEmailPage';
import { AuthProvider } from './context/AuthContext';
import './App.css'

const App = () => {
  return (

    <Router>
      <AuthProvider>
        <Navbar />  {/* Render the Navbar */}
        <Routes>
          <Route path="/reports" element={<ReportList />} />
          <Route path="/submit-report" element={<ReportSubmission />} />
          <Route path="/report/:id" element={<ReportDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} /> {/* Add route for email verification */}
          <Route path="/verify-email" element={<VerifyPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} /> {/* Add route for Change Password */}
          <Route path='/change-email' element={<ChangeEmailPage />}></Route>
          <Route path="/" element={<HomePage />} />  {/* Default route */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
