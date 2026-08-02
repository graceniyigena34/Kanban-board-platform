import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProjects } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projectCount, setProjectCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const projects = await getProjects();
      if (!active) return;
      setProjectCount(projects.length);
      setTaskCount(projects.reduce((count, project) => count + (project.tasks?.length ?? 0), 0));
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-sm text-gray-400">Welcome back,</p>
          <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Projects</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{projectCount}</p>
          </div>
          <div className="bg-blue-900 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-blue-300">Total Tasks</p>
            <p className="text-3xl font-bold text-white mt-1">{taskCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Active Boards</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{projectCount}</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            { icon: '', title: 'Manage Projects', desc: 'Create and view all your projects.', action: () => navigate('/projects') },
            { icon: '', title: 'View Tasks', desc: 'See all tasks across every board.', action: () => navigate('/tasks') },
            { icon: '', title: 'Open a Board', desc: 'Jump into a project Kanban board.', action: () => navigate('/projects') },
          ].map((item) => (
            <div
              key={item.title}
              onClick={item.action}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-900 hover:shadow-md cursor-pointer transition"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-blue-900 rounded-2xl p-6 text-white">
          <h2 className="font-bold text-lg mb-3">Getting Started</h2>
          <ul className="space-y-2 text-sm text-blue-200">
            <li>→ Go to <span className="text-white font-medium">Projects</span> in the sidebar to create your first project</li>
            <li>→ Open a project board and add tasks to columns</li>
            <li>→ Drag and drop tasks between columns to track progress</li>
            <li>→ Visit <span className="text-white font-medium">Tasks</span> to see all tasks in one place</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
