// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import CrearPerfil from "./components/perfil/CrearPerfil";
import VerPerfil from "./components/perfil/VerPerfil";
import ExplorarPerfiles from "./components/explorar/ExplorarPerfiles";
import VerPerfilPublico from "./pages/VerPerfilPublico"; // ✅ importar la página pública

import AuthProvider from "./context/AuthProvider";
import AuthLayout from "./components/comunes/AuthLayout";
import PrivateRoute from "./components/comunes/PrivateRoute";

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
        {/* Home */}
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
            </Motion.div>
          }
        />

        {/* Login y Register */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <Motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Login />
              </Motion.div>
            }
          />
          <Route
            path="/register"
            element={
              <Motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Register />
              </Motion.div>
            }
          />
        </Route>

        {/* Rutas privadas */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/crear-perfil"
            element={
              <Motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <CrearPerfil />
              </Motion.div>
            }
          />
          <Route
            path="/ver-perfil"
            element={
              <Motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <VerPerfil />
              </Motion.div>
            }
          />
        </Route>

        {/* Explorar perfiles */}
        <Route
          path="/explorar"
          element={
            <Motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ExplorarPerfiles />
            </Motion.div>
          }
        />

        {/* 👇 Nueva ruta pública dinámica para ver perfiles */}
        <Route
          path="/perfil/:id"
          element={
            <Motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <VerPerfilPublico />
            </Motion.div>
          }
        />

        {/* NotFound */}
        <Route
          path="*"
          element={
            <Motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <NotFound />
            </Motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
