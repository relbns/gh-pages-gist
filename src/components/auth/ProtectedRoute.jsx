import { useEffect, useState } from 'react';
import { isLoggedIn, isSetup } from '../../services/authService';
import { LoginForm } from './LoginForm';
import { SetupForm } from './SetupForm';

export function ProtectedRoute({ children }) {
  const [authStatus, setAuthStatus] = useState('checking');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    if (!isSetup()) {
      setAuthStatus('setup');
    } else if (!isLoggedIn()) {
      setAuthStatus('login');
    } else {
      setAuthStatus('authenticated');
    }
  };

  const handleLoginSuccess = () => {
    setAuthStatus('authenticated');
  };

  const handleSetupComplete = () => {
    setAuthStatus('login');
  };

  // Render based on auth status
  if (authStatus === 'checking') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  if (authStatus === 'setup') {
    return <SetupForm onSetupComplete={handleSetupComplete} />;
  }

  if (authStatus === 'login') {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // User is authenticated
  return children;
}
