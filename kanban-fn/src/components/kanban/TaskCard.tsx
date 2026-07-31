import { useState } from 'react';
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
      {/* Card */}
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('taskId', task.id);
          e.dataTransfer.setData('fromColumnId', task.columnId);
        }}
        onClick={openModal}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-900 transition group"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 text-sm leading-snug">{task.title}</h3>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id, task.columnId); }}
            className="text-gray-300 hover:text-red-400 transition text-lg leading-none opacity-0 group-hover:opacity-100 shrink-0"
          >
            ×
          </button>
        </div>
        {task.description && (
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{task.description}</p>
        )}
        {(task.dueDate || task.estimatedHours) && (
          <div className="flex items-center gap-3 mt-2">
            {task.dueDate && (
              <span className="text-xs text-gray-400">📅 {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
            {task.estimatedHours && (
              <span className="text-xs text-gray-400">⏱ {task.estimatedHours}h</span>
            )}
          </div>
        )}
        <div className="mt-3">
          <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${priority_.className}`}>
            {priority_.label}
          </span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit Task' : 'Task Details'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
            </div>

            {editing ? (
              /* Edit Form */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated hours</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    placeholder="e.g. 2.5"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-xl transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Title</p>
                  <p className="font-semibold text-gray-900">{task.title}</p>
                </div>
                {task.description && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-700">{task.description}</p>
                  </div>
                )}
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Priority</p>
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${priority_.className}`}>
                      {priority_.label}
                    </span>
                  </div>
                  {task.dueDate && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Due date</p>
                      <p className="text-sm text-gray-700">📅 {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {task.estimatedHours && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Estimated</p>
                      <p className="text-sm text-gray-700">⏱ {task.estimatedHours}h</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-xl transition"
                  >
                    Edit Task
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 rounded-xl transition"
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
