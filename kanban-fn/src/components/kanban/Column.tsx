import { useState } from 'react';
import TaskCard from './TaskCard';
import type { Column as ColumnType, Task } from '../../services/api';

interface Props {
  column: ColumnType;
  onDrop: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
  onUpdateTask: (taskId: string, columnId: string, data: { title: string; description?: string; priority: string; dueDate?: string; estimatedHours?: number }) => void;
  onAddTask: (columnId: string, title: string, description: string, priority: string, dueDate: string, estimatedHours: string) => void;
}

const columnStyles: Record<string, { dot: string; badge: string; dragBorder: string; dragBg: string }> = {
  'To Do':       { dot: 'bg-blue-600',   badge: 'bg-blue-600 text-white',   dragBorder: 'border-blue-600',   dragBg: 'bg-blue-50' },
  'In Progress': { dot: 'bg-yellow-500', badge: 'bg-yellow-500 text-white', dragBorder: 'border-yellow-500', dragBg: 'bg-yellow-50' },
  'Done':        { dot: 'bg-green-600',  badge: 'bg-green-600 text-white',  dragBorder: 'border-green-600',  dragBg: 'bg-green-50' },
};

const defaultStyle = { dot: 'bg-blue-900', badge: 'bg-blue-900 text-white', dragBorder: 'border-blue-900', dragBg: 'bg-blue-50' };

export default function Column({ column, onDrop, onDeleteTask, onUpdateTask, onAddTask }: Props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');

  const styles = columnStyles[column.name] ?? defaultStyle;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    const fromColumnId = e.dataTransfer.getData('fromColumnId');
    if (taskId && fromColumnId !== column.id) {
      onDrop(taskId, fromColumnId, column.id);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(column.id, title.trim(), description.trim(), priority, dueDate, estimatedHours);
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setDueDate('');
    setEstimatedHours('');
    setShowAdd(false);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`flex w-80 shrink-0 flex-col rounded-[28px] border p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition ${
        isDragOver ? `${styles.dragBg} ${styles.dragBorder} scale-[1.01]` : 'panel-surface'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
          <h2 className="text-sm font-extrabold tracking-tight text-slate-950">{column.name}</h2>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${styles.badge}`}>
          {column.tasks.length}
        </span>
      </div>

      <div className="flex min-h-15 flex-1 flex-col gap-2.5 rounded-[22px] bg-white/35 p-1">
        {column.tasks.map((task: Task) => (
          <TaskCard key={task.id} task={task} onDelete={onDeleteTask} onUpdate={onUpdateTask} />
        ))}
      </div>

      {showAdd ? (
        <form onSubmit={handleAddSubmit} className="mt-3 space-y-2 rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
            className="field-shell text-sm"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="field-shell text-sm"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="field-shell text-sm"
          >
            <option value="LOW">Low priority</option>
            <option value="MEDIUM">Medium priority</option>
            <option value="HIGH">High priority</option>
          </select>

          {/* Due Date */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="field-shell text-sm"
            />
          </div>

          {/* Estimated Hours */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Estimated hours</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="e.g. 2.5"
              className="field-shell text-sm"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Add Task
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="px-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-dashed border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-950"
        >
          <span className="text-lg leading-none">+</span> Add task
        </button>
      )}
    </div>
  );
}
