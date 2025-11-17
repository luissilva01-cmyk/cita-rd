// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// 🏠 Páginas principales
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import ExplorarPerfiles from "./pages/ExplorarPerfiles";
import ExplorarPerfilesV2 from "./pages/ExplorarPerfilesV2"; // ✅ Nueva versión de explorar
import NotFound from "./pages/NotFound";

// 🔐 Páginas de autenticación
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Recuperar from "./pages/Auth/Recuperar";
import CorreoEnviado from "./pages/Auth/CorreoEnviado"; // ✅ Página de confirmación

// 🌐 Componentes comunes
import Navbar from "./components/comunes/Navbar";

// 🧩 Contextos y proveedores
import { AuthProvider } from "./context/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      {/* 🧭 Barra de navegación global */}
      <Navbar />

      {/* 🚦 Rutas principales */}
      <Routes>
        {/* 🏠 Inicio */}
        <Route path="/" element={<Home />} />

        {/* 🔐 Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/correo-enviado" element={<CorreoEnviado />} />

        {/* 👤 Perfiles */}
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />

        {/* 🌍 Explorar y Descubrir */}
        <Route path="/explorar" element={<ExplorarPerfiles />} />
        <Route path="/descubrir" element={<ExplorarPerfilesV2 />} /> {/* ✅ Nueva ruta y nombre */}

        {/* 🚫 Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
