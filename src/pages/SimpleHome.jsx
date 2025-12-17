import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SimpleHome() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  console.log('SimpleHome - user:', user, 'loading:', loading);

  // Usar useEffect para la redirección en lugar de hacerlo directamente en el render
  useEffect(() => {
    if (!loading && user) {
      console.log('User is logged in, redirecting to /home');
      navigate("/home");
    }
  }, [user, loading, navigate]);

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

  // Si el usuario está logueado, mostrar un mensaje mientras redirige
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          CitaRD
        </h1>
        
        <p className="text-gray-600 mb-8">
          Encuentra tu amor verdadero en República Dominicana
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Comenzar Gratis
          </button>
          
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            Ya tengo cuenta
          </button>

          <button
            onClick={() => navigate("/test")}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300"
          >
            Página de Prueba
          </button>
        </div>
      </div>
    </div>
  );
}