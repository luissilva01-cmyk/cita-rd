// cita-rd/src/App-Simple.tsx - Versión simplificada para debug
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import ForgotPasswordNoStorage from './pages/Auth/ForgotPasswordNoStorage';

const AppSimple: React.FC = () => {
  console.log('🚀 AppSimple renderizando...');

  return (
    <Router>
      <Routes>
        {/* Rutas públicas (sin autenticación) */}
        <Route 
          path="/login" 
          element={<Login />} 
        />
        <Route 
          path="/register" 
          element={<Register />} 
        />
        <Route 
          path="/forgot-password" 
          element={<ForgotPasswordNoStorage />} 
        />
        
        {/* Ruta por defecto */}
        <Route 
          path="/" 
          element={<Navigate to="/login" replace />} 
        />
        
        {/* Ruta 404 */}
        <Route 
          path="*" 
          element={<Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
};

export default AppSimple;