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

  console.log('🔄 AuthWrapper - currentView:', currentView);

  const handleNavigateToRegister = () => {
    console.log('📝 AuthWrapper - Navegando a Register');
    setCurrentView('register');
  };

  const handleNavigateToLogin = () => {
    console.log('🔐 AuthWrapper - Navegando a Login');
    setCurrentView('login');
  };

  return (
    <>
      {currentView === 'login' ? (
        <Login onNavigateToRegister={handleNavigateToRegister} />
      ) : (
        <Register onNavigateToLogin={handleNavigateToLogin} />
      )}
    </>
  );
};

export default AuthWrapper;
