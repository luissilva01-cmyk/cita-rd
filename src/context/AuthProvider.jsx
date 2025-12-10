import React, { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("🔄 Auth state changed:", firebaseUser);

      if (firebaseUser) {
        setUser(firebaseUser);

        localStorage.setItem(
          "usuario",
          JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          })
        );

        localStorage.setItem("uid", firebaseUser.uid);
      } else {
        setUser(null);
        localStorage.removeItem("usuario");
        localStorage.removeItem("uid");
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
