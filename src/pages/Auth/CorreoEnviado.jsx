import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Mail } from "lucide-react";

export default function CorreoEnviado() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-200 to-purple-200 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Mail className="text-purple-500 w-16 h-16 animate-bounce-slow" />
            <CheckCircle className="text-green-500 w-6 h-6 absolute -bottom-1 -right-1" />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          ¡Correo Enviado!
        </h2>
        <p className="text-gray-600 mb-6">
          Hemos enviado un enlace para restablecer tu contraseña.  
          Revisa tu bandeja de entrada o la carpeta de spam.
        </p>

        <Link
          to="/login"
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-300"
        >
          Volver al inicio de sesión
        </Link>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.8s infinite;
        }
      `}</style>
    </div>
  );
}
