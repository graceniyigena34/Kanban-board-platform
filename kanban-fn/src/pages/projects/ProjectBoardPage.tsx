import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectBoard, createColumn, type Board } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BoardComponent from '../../components/kanban/Board';

export default function ProjectBoardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newColName, setNewColName] = useState('');
  const [addingCol, setAddingCol] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    getProjectBoard(projectId)
      .then(setBoard)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim() || !projectId || !board) return;
    const col = await createColumn(projectId, newColName.trim(), board.columns.length + 1);
    setBoard({ ...board, columns: [...board.columns, col] });
    setNewColName('');
    setAddingCol(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-900 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !board) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
            {error || 'Board not found'}
          </div>
          <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-900 hover:underline text-sm">
            ← Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-400 hover:text-blue-900 transition mb-1 flex items-center gap-1"
            >
              ← Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{board.name}</h1>
            {board.description && (
              <p className="text-gray-500 text-sm mt-1">{board.description}</p>
            )}
          </div>
        </div>

        <BoardComponent board={board} onBoardChange={setBoard} />

        <div className="mt-6">
          {addingCol ? (
            <form onSubmit={handleAddColumn} className="flex items-center gap-2">
              <input
                autoFocus
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                placeholder="Column name"
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
              />
              <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-800 transition">
                Add
              </button>
              <button type="button" onClick={() => { setAddingCol(false); setNewColName(''); }} className="text-gray-400 text-sm hover:text-blue-900">
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setAddingCol(true)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-900 transition font-medium"
            >
              <span className="text-lg leading-none">+</span> Add Column
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
