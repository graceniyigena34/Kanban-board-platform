import { useState } from 'react';
import { Clock3, PencilLine, Trash2 } from 'lucide-react';
import type { Task } from '../../services/api';

interface Props {
  task: Task;
  onDelete: (taskId: string, columnId: string) => void;
  onUpdate: (taskId: string, columnId: string, data: {
    title: string;
    description?: string;
    priority: string;
    dueDate?: string;
    estimatedHours?: number;
  }) => void;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  HIGH:   { label: 'High',   className: 'bg-red-600 text-white' },
  MEDIUM: { label: 'Medium', className: 'bg-blue-100 text-blue-900' },
  LOW:    { label: 'Low',    className: 'bg-gray-100 text-gray-600' },
};

export default function TaskCard({ task, onDelete, onUpdate }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ?? '');
  const [estimatedHours, setEstimatedHours] = useState(task.estimatedHours?.toString() ?? '');

  const priority_ = priorityConfig[task.priority] ?? priorityConfig.MEDIUM;

  const openModal = () => {
    // reset to latest task values
    setTitle(task.title);
    setDescription(task.description ?? '');
    setPriority(task.priority);
    setDueDate(task.dueDate ?? '');
    setEstimatedHours(task.estimatedHours?.toString() ?? '');
    setEditing(false);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onUpdate(task.id, task.columnId, {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
    });
    setEditing(false);
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!confirm('Delete this task?')) return;
    onDelete(task.id, task.columnId);
    setShowModal(false);
  };

  return (
    <>
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('taskId', task.id);
          e.dataTransfer.setData('fromColumnId', task.columnId);
        }}
        onClick={openModal}
        className="group cursor-pointer rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_36px_rgba(15,23,42,0.1)]"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-extrabold leading-snug text-slate-950">{task.title}</h3>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id, task.columnId); }}
            className="shrink-0 rounded-full p-1 text-slate-300 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 lg:opacity-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
        {task.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-6 text-slate-500">{task.description}</p>
        )}
        {(task.dueDate || task.estimatedHours) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1">
                <Clock3 size={13} className="text-slate-400" />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.estimatedHours && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1">
                <Clock3 size={13} className="text-slate-400" />
                {task.estimatedHours}h
              </span>
            )}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${priority_.className}`}>
            {priority_.label}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition group-hover:text-slate-700">
            <PencilLine size={13} />
            Open
          </span>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="panel-surface-strong w-full max-w-md rounded-[30px] p-6 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-950">
                {editing ? 'Edit Task' : 'Task Details'}
              </h2>
              <button onClick={() => setShowModal(false)} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-950">×</button>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="field-shell"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="field-shell resize-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                    className="field-shell"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Due date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="field-shell"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Estimated hours</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    placeholder="e.g. 2.5"
                    className="field-shell"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleSave}
                    className="flex-1 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-950"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Title</p>
                  <p className="font-extrabold text-slate-950">{task.title}</p>
                </div>
                {task.description && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Description</p>
                    <p className="text-sm leading-7 text-slate-600">{task.description}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-4">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Priority</p>
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${priority_.className}`}>
                      {priority_.label}
                    </span>
                  </div>
                  {task.dueDate && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Due date</p>
                      <p className="text-sm text-slate-700">📅 {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {task.estimatedHours && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Estimated</p>
                      <p className="text-sm text-slate-700">⏱ {task.estimatedHours}h</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 border-t border-slate-200 pt-4">
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-1 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Edit Task
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    Delete Task
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
