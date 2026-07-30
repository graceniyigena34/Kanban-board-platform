import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <NavLink to="/" className="text-xl font-semibold text-slate-900">
            TaskFlow
          </NavLink>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'font-semibold text-slate-900' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? 'font-semibold text-slate-900' : '')}>
            Projects
          </NavLink>
          {user ? (
            <button onClick={handleLogout} className="rounded bg-slate-900 px-3 py-2 text-white">
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="rounded bg-slate-900 px-3 py-2 text-white">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
