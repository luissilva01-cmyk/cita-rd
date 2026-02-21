import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from '../../src/pages/Auth/Login';
import Register from '../../src/pages/Auth/Register';

interface AuthWrapperProps {
  onBack: () => void;
  initialRoute?: string;
}

// Componente interno para manejar la navegación inicial
const AuthRoutes: React.FC<{ initialRoute: string }> = ({ initialRoute }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navegar a la ruta inicial cuando el componente se monta
    navigate(initialRoute, { replace: true });
  }, [initialRoute, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const AuthWrapper: React.FC<AuthWrapperProps> = ({ onBack, initialRoute = '/login' }) => {
  return (
    <Router>
      <AuthRoutes initialRoute={initialRoute} />
    </Router>
  );
};

export default AuthWrapper;
