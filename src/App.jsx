// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// 🏠 Páginas principales
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import ExplorarPerfiles from "./pages/ExplorarPerfiles";
import ExplorarPerfilesV2 from "./pages/ExplorarPerfilesV2"; // Swipe/Tinder Style
import NotFound from "./pages/NotFound";

// 🔐 Autenticación
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Recuperar from "./pages/Auth/Recuperar";
import CorreoEnviado from "./pages/Auth/CorreoEnviado";

// 🌐 Componentes comunes
import Navbar from "./components/comunes/Navbar";

// 🧩 Contextos
import { AuthProvider } from "./context/AuthProvider";

// 🗨️ Páginas del chat (nuevo)
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <AuthProvider>
      {/* 🧭 Barra de navegación global */}
      <Navbar />

      {/* 🚦 Rutas */}
      <Routes>
        {/* 🏠 Inicio */}
        <Route path="/" element={<Home />} />

        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/correo-enviado" element={<CorreoEnviado />} />

        {/* 👤 Perfiles */}
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />

        {/* 🌍 Explorar */}
        <Route path="/explorar" element={<ExplorarPerfiles />} />
        <Route path="/descubrir" element={<ExplorarPerfilesV2 />} />

        {/* 💬 Chat (nuevo) */}
        <Route path="/chat/:chatId" element={<ChatPage />} />

        {/* 🚫 Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
