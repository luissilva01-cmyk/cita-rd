import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

// Hook oficial y único
export function useAuth() {
  return useContext(AuthContext);
}
