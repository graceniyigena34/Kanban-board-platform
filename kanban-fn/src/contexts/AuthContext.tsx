import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister, type User } from '../services/api';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'taskflow_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw) as { user?: User };
        if (session.user) setUser(session.user);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) throw new Error('All fields are required');
    await apiRegister(name, email, password);
    const result = await apiLogin(email, password);
    setUser(result.user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(result));
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error('Email and password are required');
    const result = await apiLogin(email, password);
    setUser(result.user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(result));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
