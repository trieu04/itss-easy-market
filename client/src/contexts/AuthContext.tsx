import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
<<<<<<< HEAD
import authService, { User } from '../services/authService';
=======

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
  };
}
>>>>>>> 9a2c0e03ae62adbc3b845a8ef2bfb046436223d7

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Kiểm tra token trong localStorage
        if (authService.isAuthenticated()) {
          // Verify token với server
          const user = await authService.getCurrentUser();
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        }
      } catch (error) {
<<<<<<< HEAD
        // Token không hợp lệ, xóa khỏi localStorage
        authService.logout();
        console.error('Token verification failed:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
=======
        localStorage.removeItem('user');
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Giả lập API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data - trong thực tế sẽ gọi API
    const mockUser: User = {
      id: '1',
      name: 'Người Dùng',
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('Người Dùng')}&background=10b981&color=fff`,
      preferences: {
        language: 'vi',
        theme: 'light',
        notifications: true,
>>>>>>> 9a2c0e03ae62adbc3b845a8ef2bfb046436223d7
      }
    };

    initAuth();
  }, []);

<<<<<<< HEAD
  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await authService.login({
        username: email, // Backend nhận username (có thể là email)
        password: password,
      });
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await authService.register({
        name,
        email,
        password,
      });
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const logout = () => {
    authService.logout();
=======
  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Giả lập API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: name,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`,
      preferences: {
        language: 'vi',
        theme: 'light',
        notifications: true,
      }
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
  };

  const logout = () => {
    localStorage.removeItem('user');
>>>>>>> 9a2c0e03ae62adbc3b845a8ef2bfb046436223d7
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
    // TODO: Gọi API để cập nhật profile trên server
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}; 