// src/components/comunes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { usuario, loading } = useAuth();

  if (loading) return <p>Cargando...</p>; // O spinner

  return usuario ? children : <Navigate to="/login" replace />;
}
