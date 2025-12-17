import React from 'react';
import { useLocation } from 'react-router-dom';
import TopNavigation from '../comunes/TopNavigation';
import BottomNavigation from '../comunes/BottomNavigation';

export default function AppLayout({ children }) {
  const location = useLocation();
  
  // Páginas que no necesitan navegación
  const noNavPages = ['/', '/login', '/register', '/recuperar', '/correo-enviado'];
  const showNavigation = !noNavPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Solo en desktop */}
      {showNavigation && (
        <div className="hidden lg:block">
          <TopNavigation />
        </div>
      )}

      {/* Main Content */}
      <main className={showNavigation ? 'lg:pt-0' : ''}>
        {children}
      </main>

      {/* Bottom Navigation - Solo en móvil */}
      {showNavigation && (
        <div className="lg:hidden">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}