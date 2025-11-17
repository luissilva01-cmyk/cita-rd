import React, { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔄 Detectado cambio de autenticación:", user);

      if (user) {
        setUsuario(user);
        console.log("👥 [AuthProvider] Usuario actual:", user);

        // ✅ Guardamos el UID y el email en localStorage
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
          })
        );

        // Guardamos el uid también por separado (por compatibilidad)
        localStorage.setItem("uid", user.uid);
      } else {
        setUsuario(null);
        console.log("👥 [AuthProvider] Usuario actual:", null);

        // ✅ Limpiamos storage al cerrar sesión
        localStorage.removeItem("usuario");
        localStorage.removeItem("uid");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};
