interface Props {
  task: {
    id: string;
    title: string;
    description?: string | null;
    priority: string;
    columnId: string;
    projectId: string;
  };
  onDelete: (taskId: string, columnId: string) => void;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  HIGH: { label: 'High', className: 'bg-blue-900 text-white' },
  MEDIUM: { label: 'Medium', className: 'bg-blue-100 text-blue-900' },
  LOW: { label: 'Low', className: 'bg-gray-100 text-gray-600' },
};

export default function TaskCard({ task, onDelete }: Props) {
  const priority = priorityConfig[task.priority] ?? priorityConfig.MEDIUM;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.setData('fromColumnId', task.columnId);
      }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-blue-900 transition group"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug">{task.title}</h3>
        <button
          onClick={() => onDelete(task.id, task.columnId)}
          className="text-gray-300 hover:text-red-400 transition text-lg leading-none opacity-0 group-hover:opacity-100 shrink-0"
        >
          ×
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{task.description}</p>
      )}
      <div className="mt-3">
        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${priority.className}`}>
          {priority.label}
        </span>
      </div>
    </div>
  );
}
