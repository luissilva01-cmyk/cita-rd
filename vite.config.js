import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  envPrefix: "VITE_", // ✅ esto asegura que VITE_ variables se expongan
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) return "firebase-vendor";
            if (id.includes("lucide-react")) return "icons-vendor";
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  optimizeDeps: {
    include: ["firebase/auth", "firebase/firestore", "lucide-react"],
  },
});
