import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User, UserRole } from '../types';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<string>; // Returns the role
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

interface DecodedToken {
  user: {
    id: string;
    role: UserRole;
  };
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          api.get(`/users/${decoded.user.id}`)
             .then(res => {
                setUser({ ...res.data, id: res.data._id }); // Map _id to id
             })
             .catch(() => {
                logout();
             });
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<string> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      
      const decoded = jwtDecode<DecodedToken>(token);
      
      // Fetch full user profile
      try {
        const userRes = await api.get(`/users/${decoded.user.id}`);
        setUser({ ...userRes.data, id: userRes.data._id });
        return userRes.data.role;
      } catch (err) {
        // Fallback using token data if fetch fails
        setUser({ ...decoded.user, name: 'Utilisateur', email } as any);
        return decoded.user.role;
      }
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
      try {
        // Just create the account, do not auto-login
        await api.post('/auth/signup', { name, email, password });
      } catch (error) {
        console.error("Signup error", error);
        throw error;
      }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === UserRole.ADMIN,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};