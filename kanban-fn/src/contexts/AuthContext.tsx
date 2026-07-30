import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem('taskflow_token');
    const storedUser = window.localStorage.getItem('taskflow_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Please enter your email and password');
    }

    const demoUser: User = {
      id: 'demo-user',
      name: 'Demo User',
      email,
    };

    const demoToken = 'demo-token';
    setUser(demoUser);
    setToken(demoToken);
    window.localStorage.setItem('taskflow_token', demoToken);
    window.localStorage.setItem('taskflow_user', JSON.stringify(demoUser));
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error('Please complete all fields');
    }

    const demoUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
    };

    const demoToken = 'demo-token';
    setUser(demoUser);
    setToken(demoToken);
    window.localStorage.setItem('taskflow_token', demoToken);
    window.localStorage.setItem('taskflow_user', JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem('taskflow_token');
    window.localStorage.removeItem('taskflow_user');
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
