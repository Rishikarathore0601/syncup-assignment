'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = Cookies.get('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      Cookies.set('accessToken', data.data.accessToken, { expires: 1 }); // 1 day
      Cookies.set('refreshToken', data.data.refreshToken, { expires: 7 }); // 7 days
      
      const userData = data.data.user;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      
      Cookies.set('accessToken', data.data.accessToken, { expires: 1 });
      Cookies.set('refreshToken', data.data.refreshToken, { expires: 7 });
      
      const userData = data.data.user;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
