// src/components/comunes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth"; // IMPORT CORRECTO
import Spinner from "./Spinner";

export default function PrivateRoute({ children }) {
  const { usuario, loading } = useAuth();

  if (loading) return <Spinner />; // Mejor experiencia visual

  return usuario ? children : <Navigate to="/login" replace />;
}
