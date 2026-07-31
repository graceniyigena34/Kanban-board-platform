import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="font-semibold text-blue-900 text-sm tracking-wide">Project Workspace</h2>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
        <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
          {initials}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-blue-900 transition font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
