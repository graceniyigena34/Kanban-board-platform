import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject, type Project } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const project = await createProject(name.trim(), description.trim() || undefined);
      setProjects((prev) => [...prev, project]);
      setName('');
      setDescription('');
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-blue-400">Welcome back,</p>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name} 👋</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
          >
            <span className="text-lg leading-none">+</span> New Project
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
            <p className="text-sm text-gray-500">Total Projects</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{projects.length}</p>
          </div>
          <div className="bg-blue-600 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-blue-200">Active Boards</p>
            <p className="text-3xl font-bold text-white mt-1">{projects.length}</p>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-blue-200">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-600 font-medium">No projects yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "New Project" to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:border-blue-400 hover:shadow-md cursor-pointer transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {project.name[0].toUpperCase()}
                  </div>
                  <button
                    onClick={(e) => handleDelete(project.id, e)}
                    className="text-blue-200 hover:text-red-400 transition text-xl leading-none opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition">{project.name}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description || 'No description'}</p>
                <div className="mt-4 text-xs text-blue-500 font-semibold">Open Board →</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-blue-900/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Create New Project</h2>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Project name</label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Website Redesign"
                  className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="What is this project about?"
                  className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition">
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setName(''); setDescription(''); setError(''); }}
                  className="px-5 py-2.5 rounded-xl border border-blue-200 text-gray-600 hover:bg-blue-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
