import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../../src/pages/Auth/Login';

interface AuthWrapperProps {
  onBack: () => void;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ onBack }) => {
  return (
    <Router>
      <Login />
    </Router>
  );
};

export default AuthWrapper;
