import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // Don't check auth on public pages
      const publicPages = ['/', '/login', '/signup'];
      if (publicPages.includes(router.pathname)) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await api.get('/api/me');
        setUser(res.data);
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
        // Redirect to login only if not already there
        if (router.pathname !== '/login' && !publicPages.includes(router.pathname)) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router.pathname]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/login', { email, password });
      setUser(res.data);
      // Redirect to platform-specific dashboard
      if (res.data.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/telegram/dashboard');
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const signup = async (firstName, lastName, username, email, password) => {
    try {
      await api.post('/api/signup', { first_name: firstName, last_name: lastName, username, email, password });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Signup failed';
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    console.log('Logout called');
    try {
      const response = await api.post('/api/logout');
      console.log('Logout response:', response);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);