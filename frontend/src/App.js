import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReportList from './components/ReportList';
import ReportSubmission from './components/ReportSubmission';
import ReportDetails from './components/ReportDetails';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ChangeEmailPage from './pages/ChangeEmailPage';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import FAQPage     from './pages/FAQPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/verify-email" element={<VerifyPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/change-email" element={<ChangeEmailPage />} />
          <Route path="/about"   element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq"     element={<FAQPage />} />

          {/* Protected user routes */}
          <Route path="/reports" element={<ReportList />} />
          <Route path="/submit-report" element={<ReportSubmission />} />
          <Route path="/report/:id" element={<ReportDetails />} />

          {/* Admin dashboard */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Fallback / home */}
          <Route path="/" element={<HomePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
