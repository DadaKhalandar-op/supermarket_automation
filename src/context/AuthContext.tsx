import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  _id: string;
  username: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  sessionExpired: boolean;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const expiresAt = localStorage.getItem('expiresAt');
      
      if (storedToken && expiresAt) {
        const now = new Date().getTime();
        const expiry = new Date(expiresAt).getTime();
        
        if (now >= expiry) {
          // Session expired
          handleSessionExpired();
          setIsLoading(false);
          return;
        }
        
        // Set up auto-logout timer
        const timeUntilExpiry = expiry - now;
        const timeout = setTimeout(() => {
          handleSessionExpired();
        }, timeUntilExpiry);
        setSessionTimeout(timeout);
        
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
        } catch (error) {
          const errorResponse = error as { message?: string; sessionExpired?: boolean };
          if (errorResponse.sessionExpired) {
            handleSessionExpired();
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('expiresAt');
            setToken(null);
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
    
    return () => {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
    };
  }, []);

  const handleSessionExpired = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    setToken(null);
    setUser(null);
    setSessionExpired(true);
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
  };

  const clearSessionExpired = () => {
    setSessionExpired(false);
  };

  const login = async (username: string, password: string) => {
    const data = await authAPI.login({ username, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('expiresAt', data.expiresAt);
    setToken(data.token);
    setUser({
      _id: data._id,
      username: data.username,
      fullName: data.fullName,
      role: data.role,
    });
    setSessionExpired(false);
    
    // Set up auto-logout timer
    const expiresAt = new Date(data.expiresAt).getTime();
    const now = new Date().getTime();
    const timeUntilExpiry = expiresAt - now;
    
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    
    const timeout = setTimeout(() => {
      handleSessionExpired();
    }, timeUntilExpiry);
    setSessionTimeout(timeout);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    setToken(null);
    setUser(null);
    setSessionExpired(false);
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, sessionExpired, clearSessionExpired }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
