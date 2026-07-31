import Column from './Column';
import { moveTask, createTask, deleteTask, type Board as BoardType } from '../../services/api';

interface Props {
  board: BoardType;
  onBoardChange: (board: BoardType) => void;
}

export default function Board({ board, onBoardChange }: Props) {
  const handleDrop = async (taskId: string, fromColumnId: string, toColumnId: string) => {
    // Optimistic UI update
    const updatedColumns = board.columns.map((col) => {
      if (col.id === fromColumnId) {
        return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
      }
      if (col.id === toColumnId) {
        const task = board.columns
          .find((c) => c.id === fromColumnId)
          ?.tasks.find((t) => t.id === taskId);
        if (!task) return col;
        return { ...col, tasks: [...col.tasks, { ...task, columnId: toColumnId }] };
      }
      return col;
    });
    onBoardChange({ ...board, columns: updatedColumns });
    await moveTask(taskId, fromColumnId, toColumnId, board.id);
  };

  const handleAddTask = async (columnId: string, title: string, description: string, priority: string) => {
    const task = await createTask({ title, description, priority, columnId, projectId: board.id });
    const updatedColumns = board.columns.map((col) =>
      col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
    );
    onBoardChange({ ...board, columns: updatedColumns });
  };

  const handleDeleteTask = async (taskId: string, columnId: string) => {
    await deleteTask(taskId, columnId, board.id);
    const updatedColumns = board.columns.map((col) =>
      col.id === columnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col
    );
    onBoardChange({ ...board, columns: updatedColumns });
  };

  return (
    <div className="flex gap-5 overflow-x-auto pb-4">
      {[...board.columns]
        .sort((a, b) => a.order - b.order)
        .map((column) => (
          <Column
            key={column.id}
            column={column}
            onDrop={handleDrop}
            onDeleteTask={handleDeleteTask}
            onAddTask={handleAddTask}
          />
        ))}
    </div>
  );
}
