import { useAuth } from "../../context/useAuth";

export default function EmailBanner() {
  const { user } = useAuth();

  if (!user || user.emailVerified) return null;

  return (
    <div className="bg-yellow-200 text-yellow-900 p-4 text-center font-medium">
      ⚠️ Verifica tu correo para acceder a todas las funciones
    </div>
  );
}
