// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useState, useCallback } from "react";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Componentes de perfil
import CrearPerfil from "./components/perfil/CrearPerfil";
import VerPerfilPublico from "./components/perfil/VerPerfilPublico";

// Componentes de exploración
import ExplorarPerfiles from "./components/explorar/ExplorarPerfiles";

// Context y rutas privadas
import { AuthProvider } from "./context/AuthProvider"; 
import AuthLayout from "./components/comunes/AuthLayout";
import PrivateRoute from "./components/comunes/PrivateRoute";

// Otros componentes
import EmailBanner from "./components/comunes/EmailBanner";
import ChatTest from "./components/chat/ChatTest";
import EnvDebug from "./components/EnvDebug";

// Toast
import ToastContext from "./context/ToastContext";

function AnimatedRoutes() {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const pageTransition = { duration: 0.4 };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Home />
              <div className="p-6 bg-gray-100 mt-6 rounded-lg shadow">
                <ChatTest />
              </div>
            </Motion.div>
          }
        />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/crear-perfil" element={<CrearPerfil />} />
      
        </Route>
        <Route path="/explorar" element={<ExplorarPerfiles />} />
        <Route path="/perfil/:id" element={<VerPerfilPublico />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <AuthProvider>
      <ToastContext.Provider value={{ showToast }}>
        <Router>
          <EmailBanner />
          <AnimatedRoutes />

          {/* Contenedor de toasts */}
          <div className="fixed bottom-4 right-4 space-y-2 z-50">
            {toasts.map(toast => (
              <Motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`px-4 py-2 rounded-lg shadow-md text-white
                  ${toast.type === "success" ? "bg-green-500" : ""}
                  ${toast.type === "error" ? "bg-red-500" : ""}
                  ${toast.type === "warning" ? "bg-yellow-500" : ""}
                  ${toast.type === "info" ? "bg-blue-500" : ""}
                `}
              >
                {toast.message}
              </Motion.div>
            ))}
          </div>
        </Router>
      </ToastContext.Provider>
    </AuthProvider>
  );
}

export default App;
