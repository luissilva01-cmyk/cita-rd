// src/App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/comunes/Navbar";
import { AuthProvider } from "./context/AuthProvider";

// 💤 Carga diferida (lazy loading) para optimizar rendimiento
const Home = lazy(() => import("./pages/Home"));
const Perfil = lazy(() => import("./pages/Perfil"));
const EditarPerfil = lazy(() => import("./pages/EditarPerfil"));
const ExplorarPerfiles = lazy(() => import("./pages/ExplorarPerfiles"));
const ExplorarPerfilesV2 = lazy(() => import("./pages/ExplorarPerfilesV2"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Recuperar = lazy(() => import("./pages/Auth/Recuperar"));
const CorreoEnviado = lazy(() => import("./pages/Auth/CorreoEnviado"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const Preferencias = lazy(() => import("./pages/Preferencias"));
const UsuariosBloqueados = lazy(() => import("./pages/UsuariosBloqueados"));
const ConfiguracionCuenta = lazy(() => import("./pages/ConfiguracionCuenta"));
const MisMatches = lazy(() => import("./pages/MisMatches"));
const ExplorarPerfilesSwipe = lazy(() => import("./pages/ExplorarPerfilesSwipe"));
const ExplorarPerfilesMejorado = lazy(() => import("./pages/ExplorarPerfilesMejorado"));

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Suspense fallback={<div className="loading">Cargando...</div>}>
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

          {/* 🌍 Explorar */}
          <Route path="/explorar" element={<ExplorarPerfiles />} />
          <Route path="/descubrir" element={<ExplorarPerfilesMejorado />} />
          <Route path="/swipe" element={<ExplorarPerfilesSwipe />} />

          {/* 💬 Chat y Matches */}
          <Route path="/chat/:chatId" element={<ChatPage />} />
          <Route path="/matches" element={<MisMatches />} />

          {/* ⚙️ Configuración */}
          <Route path="/preferencias" element={<Preferencias />} />
          <Route path="/bloqueados" element={<UsuariosBloqueados />} />
          <Route path="/configuracion" element={<ConfiguracionCuenta />} />

          {/* 🚫 Página no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}