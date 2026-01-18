import { createContext, useContext } from "react";

export const AuthContext = createContext(undefined);

// Hook oficial y único
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}