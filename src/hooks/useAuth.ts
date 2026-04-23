import { useAuth } from '../context/AuthContext';

export function useAuthState() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    isMaster: user?.role === 'MASTER' || user?.role === 'ADMIN',
    userName: user?.name || 'Usuário',
    userEmail: user?.email || '',
  };
}

export function useAuthActions() {
  const { login, logout, refreshUser } = useAuth();
  
  return {
    login,
    logout,
    refreshUser,
  };
}

export { useAppNavigation } from './useNavigation';