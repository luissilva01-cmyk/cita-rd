// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración de Vite
export default defineConfig({
  plugins: [react()],
  base: "/", // ⚠️ necesario para deploy en Vercel
  build: {
    // Configuración de Rollup
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separar librerías externas en chunks independientes
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) {
              return "firebase-vendor"; // chunk para Firebase
            }
            if (id.includes("lucide-react")) {
              return "icons-vendor"; // chunk para íconos
            }
            return "vendor"; // resto de librerías
          }
        },
      },
    },
    chunkSizeWarningLimit: 600, // aumentar límite de advertencia
  },
  optimizeDeps: {
    include: ["firebase/auth", "firebase/firestore", "lucide-react"],
  },
});
