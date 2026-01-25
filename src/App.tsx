// cita-rd/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import MainApp from '../App';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import TermsOfService from './pages/Legal/TermsOfService';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import LoadingSpinner from './components/comunes/LoadingSpinner';

// Componente separado para rutas protegidas que usa el hook de autenticación
const ProtectedRoutes: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Error de autenticación</h1>
          <p className="text-gray-300">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rutas de autenticación (públicas) */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/app" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/app" replace /> : <Register />} 
      />
      <Route 
        path="/forgot-password" 
        element={user ? <Navigate to="/app" replace /> : <ForgotPassword />} 
      />
      
      {/* Rutas protegidas (requieren autenticación) */}
      <Route 
        path="/app/*" 
        element={user ? <MainApp /> : <Navigate to="/login" replace />} 
      />
      
      {/* Ruta por defecto */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/app" replace /> : <Navigate to="/login" replace />} 
      />
      
      {/* Ruta 404 - DEBE IR AL FINAL */}
      <Route 
        path="*" 
        element={<Navigate to="/login" replace />} 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas legales (públicas) - NO pasan por el hook de autenticación */}
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* Todas las demás rutas pasan por el componente con autenticación */}
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;