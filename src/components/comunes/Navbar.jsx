// src/components/comunes/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useAuth } from "../../context/useAuth";
import { auth } from "../../utils/firebase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { usuario, setUsuario } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    await auth.signOut();
    setUsuario(null);
    navigate("/login");
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 }
  };

  return (
    <nav className="bg-pink-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          CitaRD
        </Link>

        {/* Menú desktop */}
        <div className="hidden sm:flex space-x-4 items-center">
          <Link to="/">Inicio</Link>
          <Link to="/explorar">Explorar</Link>
          {usuario ? (
            <>
              <Link to="/ver-perfil">Mi Perfil</Link>
              <button
                onClick={cerrarSesion}
                className="bg-white text-pink-500 px-3 py-1 rounded-md font-semibold hover:bg-gray-200"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-pink-500 px-3 py-1 rounded-md font-semibold hover:bg-gray-200"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-white text-pink-500 px-3 py-1 rounded-md font-semibold hover:bg-gray-200"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          className="sm:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menú móvil con animación */}
      <AnimatePresence>
        {menuOpen && (
          <Motion.div
            className="sm:hidden bg-pink-500 px-4 pt-2 pb-4 space-y-2"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {[
              { label: "Inicio", to: "/" },
              { label: "Explorar", to: "/explorar" },
              ...(usuario ? [{ label: "Mi Perfil", to: "/ver-perfil" }] : []),
            ].map((item) => (
              <Motion.div
                key={item.to}
                variants={itemVariants}
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                <Link to={item.to}>{item.label}</Link>
              </Motion.div>
            ))}

            {usuario ? (
              <Motion.div variants={itemVariants}>
                <button
                  onClick={() => {
                    cerrarSesion();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left bg-white text-pink-500 px-3 py-1 rounded-md font-semibold hover:bg-gray-200"
                >
                  Cerrar sesión
                </button>
              </Motion.div>
            ) : (
              <>
                <Motion.div variants={itemVariants}>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block bg-white text-pink-500 px-3 py-1 rounded-md font-semibold hover:bg-gray-200"
                  >
                    Iniciar sesión
                  </Link>
                </Motion.div>
                <Motion.div variants={itemVariants}>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block bg-white text-pink-500 px-3 py-1 rounded-md font-semibold hover:bg-gray-200"
                  >
                    Registrarse
                  </Link>
                </Motion.div>
              </>
            )}
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
