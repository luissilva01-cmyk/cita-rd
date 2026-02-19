import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    strictPort: false,
    // Configuración para manejar rutas de React Router
    historyApiFallback: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: false, // ⚡ DESACTIVADO temporalmente para debugging
    rollupOptions: {
      output: {
        // Manual chunks para optimizar carga
        manualChunks: {
          // Vendor chunks - librerías grandes separadas
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/storage',
            'firebase/analytics',
          ],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          
          // Feature chunks - agrupar por funcionalidad
          'chat-features': [
            './services/chatService.ts',
            './services/voiceMessageService.ts',
            './services/callService.ts',
          ],
          'profile-features': [
            './services/profileService.ts',
            './services/photoUploadService.ts',
            './services/photoAnalysisService.ts',
          ],
          'ai-features': [
            './services/matchingAI.ts',
            './services/emotionalAI.ts',
          ],
        },
        // ⚡ FIX: Agregar timestamp para forzar nuevo hash en cada build
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`,
      },
    },
    // Optimizaciones adicionales
    chunkSizeWarningLimit: 1000, // Advertir si chunks > 1MB
    cssCodeSplit: true, // Separar CSS por chunk
    assetsInlineLimit: 4096, // Inline assets < 4KB
  },
  // Optimizaciones de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
    ],
    exclude: ['@google/generative-ai'], // Excluir si causa problemas
  },
  css: {
    postcss: null
  }
})