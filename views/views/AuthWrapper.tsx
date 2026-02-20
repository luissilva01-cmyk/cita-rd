import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../src/pages/Auth/Login';
import Register from '../../src/pages/Auth/Register';

interface AuthWrapperProps {
  onBack: () => void;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ onBack }) => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AuthWrapper;
