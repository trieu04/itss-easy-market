import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import api from '../services/api'; 

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

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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
    // Kiểm tra localStorage cho user đã đăng nhập
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
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
      }
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
  };

  // API Call  
  // const login = async (email: string, password: string) => {
  //   dispatch({ type: 'SET_LOADING', payload: true });
  //   try {
  //     const response = await api.post('/auth/sign-in', {
  //       email: email,
  //       password,
  //     });
  //     const { accessToken, user } = response.data;
  //     localStorage.setItem('accessToken', accessToken);
  //     localStorage.setItem('user', JSON.stringify(user));
  //     dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  //   } catch (error: any) {
  //     alert(error?.response?.data?.message || 'Đăng nhập thất bại');
  //   } finally {
  //     dispatch({ type: 'SET_LOADING', payload: false });
  //   }
  // };


  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.post('/auth/sign-up', { name, email, password });
      const { accessToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };


  const loginWithGoogle = async () => {
  const response = await api.get('/auth/google-oauth');
  window.location.href = response.data.url;
};

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateProfile, loginWithGoogle  }}>
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