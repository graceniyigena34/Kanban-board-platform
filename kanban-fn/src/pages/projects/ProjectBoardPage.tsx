import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createColumn, createTask, getProjectBoard, moveTask } from '../../services/api';

export default function ProjectBoardPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<{ id: string; name: string; description?: string | null; columns: Array<{ id: string; name: string; order: number; tasks: Array<any> }>; tasks: Array<any> } | null>(null);
  const [columnName, setColumnName] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshBoard = async () => {
    if (!projectId) return;
    try {
      const data = await getProjectBoard(projectId);
      setProject(data);
      if (data.columns.length > 0 && !selectedColumn) {
        setSelectedColumn(data.columns[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshBoard();
  }, [projectId]);

  const handleCreateColumn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectId) return;
    try {
      await createColumn(projectId, columnName, (project?.columns?.length ?? 0) + 1);
      setColumnName('');
      await refreshBoard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create column');
    }
  };

  const handleCreateTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectId || !selectedColumn) return;
    try {
      await createTask({
        title: taskTitle,
        description: taskDescription,
        priority,
        columnId: selectedColumn,
        projectId,
      });
      setTaskTitle('');
      setTaskDescription('');
      setPriority('MEDIUM');
      await refreshBoard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create task');
    }
  };

  const handleDrop = async (columnId: string) => {
    if (!projectId) return;
    const taskId = window.sessionStorage.getItem('dragTaskId');
    if (!taskId) return;
    try {
      await moveTask(taskId, columnId);
      window.sessionStorage.removeItem('dragTaskId');
      await refreshBoard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to move task');
    }
  };

  const columns = useMemo(() => project?.columns ?? [], [project]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Board</p>
        <h1 className="text-3xl font-semibold text-slate-900">{project?.name || 'Project board'}</h1>
        <p className="mt-2 text-slate-600">{project?.description || 'Plan work and move tasks across the board.'}</p>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleCreateColumn} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Add a column</h2>
          <div className="mt-4 flex gap-3">
            <input value={columnName} onChange={(e) => setColumnName(e.target.value)} placeholder="Column name" className="flex-1 rounded border border-slate-300 px-3 py-2" required />
            <button className="rounded bg-slate-900 px-4 py-2 font-medium text-white">Add</button>
          </div>
        </form>

        <form onSubmit={handleCreateTask} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Create a task</h2>
          <div className="mt-4 space-y-3">
            <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task title" className="w-full rounded border border-slate-300 px-3 py-2" required />
            <input value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Description" className="w-full rounded border border-slate-300 px-3 py-2" />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <select value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2">
              {columns.map((column) => <option key={column.id} value={column.id}>{column.name}</option>)}
            </select>
            <button className="w-full rounded bg-slate-900 px-4 py-2 font-medium text-white">Create task</button>
          </div>
        </form>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-slate-600">Loading board…</p> : null}

      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <div key={column.id} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(column.id)} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{column.name}</h3>
              <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-600">{column.tasks.length}</span>
            </div>
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div key={task.id} draggable onDragStart={() => window.sessionStorage.setItem('dragTaskId', task.id)} className="cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{task.title}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{task.priority}</span>
                  </div>
                  {task.description ? <p className="mt-2 text-sm text-slate-600">{task.description}</p> : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
