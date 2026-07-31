import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = { id: string; name: string; email: string };
type StoredUser = User & { password: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'taskflow_users';
const SESSION_KEY = 'taskflow_session';

function loadUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) throw new Error('All fields are required');
    const users = loadUsers();
    if (users.find((u) => u.email === email)) throw new Error('Email already registered');
    const newUser: StoredUser = { id: `user-${Date.now()}`, name, email, password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const session: User = { id: newUser.id, name, email };
    setUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error('Email and password are required');
    const users = loadUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const session: User = { id: found.id, name: found.name, email: found.email };
    setUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
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
