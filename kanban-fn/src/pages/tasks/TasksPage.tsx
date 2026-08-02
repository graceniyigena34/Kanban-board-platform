import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTasks, type TaskWithMeta } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';

const priorityConfig: Record<string, { label: string; className: string }> = {
  HIGH:   { label: 'High',   className: 'bg-red-600 text-white' },
  MEDIUM: { label: 'Medium', className: 'bg-blue-100 text-blue-900' },
  LOW:    { label: 'Low',    className: 'bg-gray-100 text-gray-600' },
};

export default function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskWithMeta[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  useEffect(() => {
    let active = true;
    (async () => {
      const items = await getAllTasks();
      if (active) setTasks(items);
    })();

    return () => {
      active = false;
    };
  }, []);

  const filtered = filter === 'ALL' ? tasks : tasks.filter((t) => t.priority === filter);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-gray-400">Overview</p>
            <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
          </div>
          <span className="bg-blue-900 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
            {tasks.length} total
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-6">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${
                filter === f
                  ? 'bg-blue-900 text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:border-blue-900'
              }`}
            >
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Tasks list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-gray-600 font-medium">No tasks found</p>
            <p className="text-gray-400 text-sm mt-1">Create tasks inside a project board</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((task) => {
              const p = priorityConfig[task.priority] ?? priorityConfig.MEDIUM;
              return (
                <div
                  key={task.id}
                  onClick={() => navigate(`/projects/${task.projectId}`)}
                  className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-blue-900 hover:shadow-md cursor-pointer transition flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-400 mt-0.5 truncate">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span className="font-medium text-blue-900">{task.projectName}</span>
                      <span>·</span>
                      <span>{task.columnName}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 px-3 py-1 text-xs font-semibold rounded-full ${p.className}`}>
                    {p.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
