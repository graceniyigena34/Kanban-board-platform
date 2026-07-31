import { useState } from 'react';
import TaskCard from './TaskCard';
import type { Column as ColumnType, Task } from '../../services/api';

interface Props {
  column: ColumnType;
  onDrop: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
  onAddTask: (columnId: string, title: string, description: string, priority: string, dueDate: string, estimatedHours: string) => void;
}

const columnStyles: Record<string, { dot: string; badge: string; dragBorder: string; dragBg: string }> = {
  'To Do':       { dot: 'bg-blue-600',   badge: 'bg-blue-600 text-white',   dragBorder: 'border-blue-600',   dragBg: 'bg-blue-50' },
  'In Progress': { dot: 'bg-yellow-500', badge: 'bg-yellow-500 text-white', dragBorder: 'border-yellow-500', dragBg: 'bg-yellow-50' },
  'Done':        { dot: 'bg-green-600',  badge: 'bg-green-600 text-white',  dragBorder: 'border-green-600',  dragBg: 'bg-green-50' },
};

const defaultStyle = { dot: 'bg-blue-900', badge: 'bg-blue-900 text-white', dragBorder: 'border-blue-900', dragBg: 'bg-blue-50' };

export default function Column({ column, onDrop, onDeleteTask, onAddTask }: Props) {
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
      className={`flex flex-col w-72 shrink-0 rounded-2xl p-4 transition border-2 ${
        isDragOver ? `${styles.dragBg} ${styles.dragBorder}` : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
          <h2 className="font-semibold text-gray-800 text-sm">{column.name}</h2>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.badge}`}>
          {column.tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-2.5 flex-1 min-h-[60px]">
        {column.tasks.map((task: Task) => (
          <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
        ))}
      </div>

      {/* Add Task Form */}
      {showAdd ? (
        <form onSubmit={handleAddSubmit} className="mt-3 bg-slate-50 rounded-xl p-3 border border-gray-200 space-y-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
          >
            <option value="LOW">Low priority</option>
            <option value="MEDIUM">Medium priority</option>
            <option value="HIGH">High priority</option>
          </select>

          {/* Due Date */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
            />
          </div>

          {/* Estimated Hours */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Estimated hours</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="e.g. 2.5"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 bg-blue-900 text-white text-sm py-1.5 rounded-lg hover:bg-blue-800 transition">
              Add Task
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="text-gray-400 text-sm px-2 hover:text-blue-900">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="mt-3 flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-900 transition font-medium"
        >
          <span className="text-lg leading-none">+</span> Add task
        </button>
      )}
    </div>
  );
}
