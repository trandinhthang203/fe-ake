import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import type { UserResponse, UserLogin, UserRegister, UserUpdate } from '../types/api';
import { toast } from 'sonner';

export type User = UserResponse;

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegister) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: UserUpdate) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      refreshProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: UserLogin) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      localStorage.setItem('auth_token', response.token);
      await refreshProfile();
      toast.success('Đăng nhập thành công!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserRegister) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Đăng ký thất bại. Vui lòng thử lại.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    toast.info('Đã đăng xuất.');
  };

  const updateProfile = async (userData: UserUpdate) => {
    try {
      setIsLoading(true);
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      toast.success('Cập nhật hồ sơ thành công!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Cập nhật hồ sơ thất bại.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const userData = await userService.getMyProfile();
      setUser(userData);
    } catch (error) {
      console.error('Refresh profile error:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
