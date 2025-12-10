// src/pages/ConfiguracionCuenta.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import toast from "react-hot-toast";
import { Shield, Mail, Lock, Trash2 } from "lucide-react";

export default function ConfiguracionCuenta() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enviandoEmail, setEnviandoEmail] = useState(false);

  const enviarVerificacion = async () => {
    if (!user) return;

    try {
      setEnviandoEmail(true);
      await sendEmailVerification(user);
      toast.success("Email de verificación enviado. Revisa tu bandeja de entrada.");
    } catch (error) {
      console.error("Error al enviar verificación:", error);
      toast.error("Error al enviar email de verificación");
    } finally {
      setEnviandoEmail(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🔐 Configuración de cuenta</h1>

      <div className="space-y-4">
        
        {/* Email */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="text-orange-500" size={24} />
            <h2 className="text-xl font-semibold">Email</h2>
          </div>
          
          <p className="text-gray-600 mb-2">{user.email}</p>
          
          {!user.emailVerified && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-yellow-800 mb-2">
                ⚠️ Tu email no está verificado
              </p>
              <button
                onClick={enviarVerificacion}
                disabled={enviandoEmail}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition disabled:opacity-50"
              >
                {enviandoEmail ? "Enviando..." : "Enviar verificación"}
              </button>
            </div>
          )}

          {user.emailVerified && (
            <div className="flex items-center gap-2 text-green-600 mt-2">
              <Shield size={20} />
              <span className="text-sm font-medium">Email verificado</span>
            </div>
          )}
        </div>

        {/* Seguridad */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="text-orange-500" size={24} />
            <h2 className="text-xl font-semibold">Seguridad</h2>
          </div>
          
          <button
            onClick={() => navigate("/cambiar-contrasena")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition"
          >
            Cambiar contraseña
          </button>
        </div>

        {/* Zona peligrosa */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="text-red-500" size={24} />
            <h2 className="text-xl font-semibold text-red-600">Zona peligrosa</h2>
          </div>
          
          <p className="text-gray-600 mb-4 text-sm">
            Eliminar tu cuenta es permanente y no se puede deshacer.
          </p>
          
          <button
            onClick={() => {
              if (confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
                toast.error("Funcionalidad en desarrollo");
              }
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition"
          >
            Eliminar cuenta
          </button>
        </div>

      </div>
    </div>
  );
}
