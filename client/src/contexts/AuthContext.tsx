import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

interface AuthContextType {
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [, setLocation] = useLocation();

  const checkAuth = useCallback(async () => {
    // Prevent multiple simultaneous checks
    if (isChecking) return;
    setIsChecking(true);

    try {
      // Check if we're in the callback flow with a code
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        console.log('In callback flow with code');
        window.location.href = `http://0.0.0.0:8000/callback?code=${code}`;
        return;
      }

      // Skip check if already authenticated and on dashboard
      if (isAuthenticated && window.location.pathname === '/home') {
        setIsChecking(false);
        return;
      }

      // Get the raw cookie string
      const cookieString = document.cookie;
      const sessionMatch = cookieString.match(/wos_session=([^;]+)/);
      const sessionValue = sessionMatch ? sessionMatch[1] : null;

      if (sessionValue) {
        try {
          const response = await fetch('http://0.0.0.0:8000/user', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${sessionValue}`
            }
          });
          
          if (response.ok) {
            setIsAuthenticated(true);
            if (window.location.pathname === '/') {
              setLocation('/home');
            }
            return;
          }
        } catch (error) {
          console.error('Error verifying session:', error);
        }
      }

      // If we get here, we're not authenticated
      setIsAuthenticated(false);
      if (window.location.pathname !== '/') {
        setLocation('/');
      }

    } finally {
      setIsChecking(false);
    }
  }, []); // Empty dependency array since we handle isChecking internally

  const logout = async () => {
    try {
      document.cookie = 'wos_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=localhost';
      setIsAuthenticated(false);
      window.location.href = 'http://0.0.0.0:8000/logout';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 