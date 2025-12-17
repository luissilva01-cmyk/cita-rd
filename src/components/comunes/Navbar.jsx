import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  User, 
  Compass, 
  Flame, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("usuario");
      localStorage.removeItem("uid");
      navigate("/login");
    } catch (err) {
      console.error("❌ Error al cerrar sesión:", err);
    }
  };

  const navItems = user ? [
    { path: "/perfil", label: "Perfil", icon: User },
    { path: "/explorar", label: "Explorar", icon: Compass },
    { path: "/descubrir", label: "Descubrir", icon: Flame },
    { path: "/matches", label: "Matches", icon: Heart },
    { path: "/preferencias", label: "Config", icon: Settings },
  ] : [
    { path: "/login", label: "Iniciar Sesión", icon: User },
    { path: "/register", label: "Registrarse", icon: Sparkles },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-sm fixed top-0 left-0 w-full z-50 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:scale-105 transition-transform"
            >
              <Heart className="text-pink-500" size={28} />
              Cita<span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">RD</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                );
              })}

              {user && (
                <button
                  onClick={cerrarSesion}
                  className="flex items-center gap-2 px-4 py-2 ml-2 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                >
                  <LogOut size={18} />
                  <span className="hidden lg:block">Salir</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isActive(item.path)
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}

                {user && (
                  <button
                    onClick={() => {
                      cerrarSesion();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white font-medium"
                  >
                    <LogOut size={20} />
                    Cerrar Sesión
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer para el navbar fijo */}
      <div className="h-20"></div>
    </>
  );
}
