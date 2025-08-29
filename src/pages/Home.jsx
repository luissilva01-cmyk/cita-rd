// src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;

export default function Home() {
  const navigate = useNavigate();
  const { usuario, setUsuario } = useAuth();

  const cerrarSesion = async () => {
    await auth.signOut();
    setUsuario(null);
    navigate("/login");
  };

  return (
    <MotionDiv
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <MotionH1
        className="text-4xl font-bold text-pink-600 mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Bienvenido a CitaRD
      </MotionH1>

      {usuario ? (
        <MotionDiv
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-lg text-gray-700">
            Hola, {usuario.email}! Explora perfiles o crea el tuyo.
          </p>
          <button
            onClick={cerrarSesion}
            className="mt-4 bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg font-semibold"
          >
            Cerrar sesión
          </button>
        </MotionDiv>
      ) : (
        <MotionDiv
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <p className="text-lg text-gray-700">
            Por favor inicia sesión o regístrate para comenzar.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg font-semibold"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-6 rounded-lg font-semibold"
            >
              Registrarse
            </button>
          </div>
        </MotionDiv>
      )}
    </MotionDiv>
  );
}
