import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function TestPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Página de Prueba
        </h1>
        
        <div className="space-y-4">
          <div>
            <strong>Estado de autenticación:</strong>
            <p className="text-gray-600">
              {user ? `Logueado como: ${user.email}` : 'No logueado'}
            </p>
          </div>
          
          <div>
            <strong>User ID:</strong>
            <p className="text-gray-600">
              {user?.uid || 'N/A'}
            </p>
          </div>
          
          <div>
            <strong>Loading:</strong>
            <p className="text-gray-600">
              {loading ? 'Sí' : 'No'}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-xl font-semibold"
          >
            Ir al Home
          </button>
          
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold"
          >
            Ir al Login
          </button>
        </div>
      </div>
    </div>
  );
}