// src/App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./context/AuthContext";

// Importar la aplicación principal de Ta' Pa' Ti
const MainApp = lazy(() => import("../App"));

// Páginas de autenticación
const Login = lazy(() => import("./pages/Auth/Login.tsx"));
const Register = lazy(() => import("./pages/Auth/Register.tsx"));

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white border-t-transparent mx-auto mb-4"></div>
      <p className="text-white">Cargando Ta' Pa' Ti...</p>
    </div>
  </div>
);

// App content component
function AppContent() {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Para demo: simular usuario autenticado
  const isDemoMode = window.location.search.includes('demo=true');
  const effectiveUser = isDemoMode ? { uid: 'demo-user', email: 'demo@citard.com' } : user;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* 🔐 Rutas de autenticación (sin usuario) */}
        {!effectiveUser && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </>
        )}

        {/* 🏠 App principal (con usuario autenticado o modo demo) */}
        {effectiveUser && (
          <Route path="/*" element={<MainApp />} />
        )}
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}