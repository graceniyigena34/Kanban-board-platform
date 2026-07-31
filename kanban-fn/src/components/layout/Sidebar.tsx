import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
      isActive
        ? 'bg-white text-blue-700'
        : 'text-blue-100 hover:bg-blue-500 hover:text-white'
    }`;

  return (
    <aside className="w-60 min-h-screen bg-blue-600 flex flex-col p-5">
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <span className="text-lg font-bold text-white">KanbanBoard</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink to="/projects" className={linkClass}>
          <FolderKanban size={18} />
          Projects
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-blue-200 hover:bg-blue-500 hover:text-white transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
