import { useState } from 'react';
import TaskCard from './TaskCard';
import type { Column as ColumnType, Task } from '../../services/api';

interface Props {
  column: ColumnType;
  onDrop: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
  onAddTask: (columnId: string, title: string, description: string, priority: string) => void;
}

export default function Column({ column, onDrop, onDeleteTask, onAddTask }: Props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

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
    onAddTask(column.id, title.trim(), description.trim(), priority);
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setShowAdd(false);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`flex flex-col w-72 shrink-0 rounded-2xl p-4 transition border-2 ${
        isDragOver ? 'bg-blue-100 border-blue-400' : 'bg-white border-blue-100'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <h2 className="font-semibold text-gray-800 text-sm">{column.name}</h2>
        </div>
        <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
          {column.tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-2.5 flex-1 min-h-[60px]">
        {column.tasks.map((task: Task) => (
          <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
        ))}
      </div>

      {/* Add Task */}
      {showAdd ? (
        <form onSubmit={handleAddSubmit} className="mt-3 bg-blue-50 rounded-xl p-3 border border-blue-200 space-y-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
            className="w-full text-sm border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full text-sm border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full text-sm border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="LOW">Low priority</option>
            <option value="MEDIUM">Medium priority</option>
            <option value="HIGH">High priority</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white text-sm py-1.5 rounded-lg hover:bg-blue-700 transition">
              Add
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="text-blue-400 text-sm px-2 hover:text-blue-700">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="mt-3 flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-700 transition font-medium"
        >
          <span className="text-lg leading-none">+</span> Add task
        </button>
      )}
    </div>
  );
}
