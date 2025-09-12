// src/context/useToast.js
import { useContext } from "react";
import { ToastContext } from "./ToastProvider";

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de un ToastProvider");
  }
  return context;
}
