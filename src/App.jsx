import React from "react";
import { Routes, Route } from "react-router-dom";

// 🏠 Páginas principales
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import ExplorarPerfiles from "./pages/ExplorarPerfiles";
import NotFound from "./pages/NotFound";

// 🔐 Páginas de autenticación
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Recuperar from "./pages/Auth/Recuperar";
import CorreoEnviado from "./pages/Auth/CorreoEnviado"; // ✅ Nueva página de confirmación

// 🌐 Componentes comunes
import Navbar from "./components/comunes/Navbar";

export default function App() {
  return (
    <>
      {/* 🧭 Barra de navegación global */}
      <Navbar />

      {/* 🚦 Rutas principales */}
      <Routes>
        {/* Página de inicio */}
        <Route path="/" element={<Home />} />

        {/* 🔐 Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/correo-enviado" element={<CorreoEnviado />} /> {/* ✅ Nueva ruta */}

        {/* 👤 Perfiles */}
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/explorar" element={<ExplorarPerfiles />} />

        {/* 🚫 Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
