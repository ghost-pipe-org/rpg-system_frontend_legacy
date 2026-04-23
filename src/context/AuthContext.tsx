import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authService } from '../services';
import type { User } from '../services/userServices/user.types';
import type { LoginCredentials } from '../services/authServices/auth.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const COOKIE_OPTIONS = {
  expires: 7,
  secure: import.meta.env.PROD,
  sameSite: 'strict' as const,
  path: '/',
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  const saveAuthData = (token: string, userData: User) => {
    Cookies.set('auth_token', token, COOKIE_OPTIONS);
    Cookies.set('auth_user', JSON.stringify(userData), COOKIE_OPTIONS);
  };

  const clearAuthData = () => {
    Cookies.remove('auth_token');
    Cookies.remove('auth_user');
  };

  const loadAuthData = () => {
    const token = Cookies.get('auth_token');
    const userData = Cookies.get('auth_user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        authService.setAuthToken(token);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        clearAuthData();
      }
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      
      saveAuthData(response.token, response.user);
      setUser(response.user);
      authService.setAuthToken(response.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    authService.logout();
    setUser(null);
  };

  const refreshUser = () => {
    loadAuthData();
  };

  const updateUser = (userData: User) => {
    const token = Cookies.get('auth_token');
    if (token) {
      saveAuthData(token, userData);
      setUser(userData);
    }
  };

  useEffect(() => {
    loadAuthData();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      loadAuthData();
    };

    window.addEventListener('storage', handleStorageChange);

    const checkCookies = () => {
      const token = Cookies.get('auth_token');
      const userData = Cookies.get('auth_user');
      
      if (!token || !userData) {
        setUser(null);
      }
    };

    const interval = setInterval(checkCookies, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
