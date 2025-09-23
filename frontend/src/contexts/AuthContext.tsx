import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import type { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to get current user:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      authService.setTokens(response.data.accessToken, response.data.refreshToken);
      setUser(response.data.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register({ name, email, password });
      authService.setTokens(response.data.accessToken, response.data.refreshToken);
      setUser(response.data.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};