// src/App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./context/AuthContext";

// 💤 Carga diferida (lazy loading) para optimizar rendimiento
const Home = lazy(() => import("./pages/SimpleHome"));
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

// 📱 Nuevas páginas de la app móvil
const SwipePage = lazy(() => import("./pages/SwipePage"));
const BuscarPage = lazy(() => import("./pages/BuscarPage"));
const MatchesPage = lazy(() => import("./pages/MatchesPage"));
const ChatsPage = lazy(() => import("./pages/ChatsPage"));

// 🧪 Página de prueba
const TestPage = lazy(() => import("./pages/TestPage"));
const TestMatchPage = lazy(() => import("./pages/TestMatchPage"));

// 🏠 Modern Home
const ModernHome = lazy(() => import("./pages/ModernHome"));
const UltraModernHome = lazy(() => import("./pages/UltraModernHome"));
const UltraModernExplore = lazy(() => import("./pages/UltraModernExplore"));
const UltraModernMatches = lazy(() => import("./pages/UltraModernMatches"));
const UltraModernChat = lazy(() => import("./pages/UltraModernChat"));
const UltraModernChats = lazy(() => import("./pages/UltraModernChats"));
const UltraModernProfile = lazy(() => import("./pages/UltraModernProfile"));
const PerfilDetallado = lazy(() => import("./pages/PerfilDetallado"));

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando CitaRD...</p>
    </div>
  </div>
);

// App content component
function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* 🏠 Inicio */}
        <Route path="/" element={<Home />} />

        {/* 🔐 Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/correo-enviado" element={<CorreoEnviado />} />

        {/* 📱 App Principal (con bottom navigation) */}
        <Route path="/swipe" element={<SwipePage />} />
        <Route path="/buscar" element={<BuscarPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* 👤 Perfiles adicionales */}
        <Route path="/editar-perfil" element={<EditarPerfil />} />

        {/* 🌍 Explorar (versiones legacy) */}
        <Route path="/explorar" element={<ExplorarPerfiles />} />
        <Route path="/descubrir" element={<ExplorarPerfilesMejorado />} />

        {/* 💬 Chat individual */}
        <Route path="/chat/:chatId" element={<ChatPage />} />

        {/* ⚙️ Configuración */}
        <Route path="/preferencias" element={<Preferencias />} />
        <Route path="/bloqueados" element={<UsuariosBloqueados />} />
        <Route path="/configuracion" element={<ConfiguracionCuenta />} />

        {/* 🧪 Página de prueba */}
        <Route path="/test" element={<TestPage />} />
        <Route path="/test-match" element={<TestMatchPage />} />

        {/* 🏠 Modern Home */}
        <Route path="/home" element={<ModernHome />} />
        <Route path="/ultra-home" element={<UltraModernHome />} />
        <Route path="/ultra-explore" element={<UltraModernExplore />} />
        <Route path="/ultra-matches" element={<UltraModernMatches />} />
        <Route path="/ultra-chat/:chatId" element={<UltraModernChat />} />
        <Route path="/ultra-chats" element={<UltraModernChats />} />
        <Route path="/ultra-profile" element={<UltraModernProfile />} />
        <Route path="/perfil/:profileId" element={<PerfilDetallado />} />

        {/* 🚫 Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}