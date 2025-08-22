// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context
import { AuthProvider } from "./context/AuthContext";

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Componentes de perfil
import CrearPerfil from "./components/perfil/CrearPerfil";
import VerPerfil from "./components/perfil/VerPerfil";

// Componentes de exploración
import ExplorarPerfiles from "./components/explorar/ExplorarPerfiles";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crear-perfil" element={<CrearPerfil />} />
          <Route path="/ver-perfil" element={<VerPerfil />} />
          <Route path="/explorar" element={<ExplorarPerfiles />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
