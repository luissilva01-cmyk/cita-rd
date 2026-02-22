import React, { useState } from 'react';
import Login from '../../src/pages/Auth/Login';
import Register from '../../src/pages/Auth/Register';

interface AuthWrapperProps {
  onBack: () => void;
  initialRoute?: string;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ onBack, initialRoute = '/login' }) => {
  const [currentView, setCurrentView] = useState<'login' | 'register'>(
    initialRoute === '/register' ? 'register' : 'login'
  );

  // Crear versiones modificadas de Login y Register que usan setCurrentView
  const LoginWithNavigation = () => {
    // Clonar Login pero interceptar navigate
    return <Login onNavigateToRegister={() => setCurrentView('register')} />;
  };

  const RegisterWithNavigation = () => {
    // Clonar Register pero interceptar navigate
    return <Register onNavigateToLogin={() => setCurrentView('login')} />;
  };

  return (
    <>
      {currentView === 'login' ? <LoginWithNavigation /> : <RegisterWithNavigation />}
    </>
  );
};

export default AuthWrapper;
