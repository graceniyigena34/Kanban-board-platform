import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createProject, getProjects } from '../../services/api';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Array<{ id: string; name: string; description?: string | null }>>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await createProject(name, description);
      setName('');
      setDescription('');
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create project');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Workspace</p>
          <h1 className="text-3xl font-semibold text-slate-900">Projects</h1>
        </div>
      </div>

      <form onSubmit={handleCreate} className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Create a new project</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" className="rounded border border-slate-300 px-3 py-2" required />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="rounded border border-slate-300 px-3 py-2" />
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <button className="mt-4 rounded bg-slate-900 px-4 py-2 font-medium text-white">Create project</button>
      </form>

      {loading ? <p className="text-slate-600">Loading projects…</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-400">
            <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{project.description || 'No description yet.'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
