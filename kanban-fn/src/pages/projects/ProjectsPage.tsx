import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject, getAllTasks, type Project } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    try {
      const project = await createProject(name.trim(), description.trim() || undefined);
      setProjects((prev) => [...prev, project]);
      setName('');
      setDescription('');
      setCreating(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this project and all its tasks?')) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const getTaskCount = (projectId: string) =>
    getAllTasks().filter((t) => t.projectId === projectId).length;

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-gray-400">Manage</p>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-medium transition"
          >
            <span className="text-lg leading-none">+</span> New Project
          </button>
        </div>

        {/* Create form (inline, shown when creating) */}
        {creating && (
          <div className="bg-white rounded-2xl p-6 border border-blue-900 shadow-md mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Project</h2>
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-xl transition">
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => { setCreating(false); setName(''); setDescription(''); setError(''); }}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects list */}
        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-5xl mb-4">📁</div>
            <p className="text-gray-600 font-medium">No projects yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "New Project" to create your first one</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map((project) => {
              const taskCount = getTaskCount(project.id);
              return (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-900 hover:shadow-md cursor-pointer transition group"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0">
                        {project.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-900 transition">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {project.description || 'No description provided'}
                        </p>
                        {/* Meta info */}
                        <div className="flex items-center gap-4 mt-3">
                          <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-blue-900 inline-block" />
                            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                            3 columns
                          </span>
                          <span className="text-xs text-blue-900 font-semibold">
                            Open Board →
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      className="text-gray-300 hover:text-red-500 transition text-2xl leading-none opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
