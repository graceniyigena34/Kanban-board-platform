import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Layers3, Plus, KanbanSquare } from 'lucide-react';
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
        <div className="panel-surface flex items-center justify-center rounded-[30px] p-16">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-950 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !board) {
    return (
      <DashboardLayout>
        <div className="panel-surface rounded-[30px] p-6 sm:p-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error || 'Board not found'}
          </div>
          <button onClick={() => navigate('/dashboard')} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950">
            <ArrowLeft size={16} />
            Back to dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section className="panel-surface rounded-[30px] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-950"
              >
                <ArrowLeft size={16} />
                Dashboard
              </button>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.2)]">
                  <KanbanSquare size={22} />
                </div>
                <div>
                  <div className="section-title">Board</div>
                  <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{board.name}</h1>
                </div>
              </div>
              {board.description && <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">{board.description}</p>}
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="soft-chip text-sm font-semibold text-slate-600">
                <Layers3 size={16} className="text-emerald-600" />
                {board.columns.length} columns
              </span>
              <span className="soft-chip text-sm font-semibold text-slate-600">
                <Plus size={16} className="text-slate-950" />
                Drag tasks to update status
              </span>
            </div>
          </div>
        </section>

        <div className="panel-surface rounded-[30px] p-4 sm:p-6">
          <BoardComponent board={board} onBoardChange={setBoard} />
        </div>

        <section className="panel-surface rounded-[30px] p-6 sm:p-8">
          {addingCol ? (
            <form onSubmit={handleAddColumn} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                autoFocus
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                placeholder="Column name"
                className="field-shell sm:max-w-sm"
              />
              <button type="submit" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Add column
              </button>
              <button type="button" onClick={() => { setAddingCol(false); setNewColName(''); }} className="text-sm font-semibold text-slate-500 transition hover:text-slate-950">
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setAddingCol(true)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <Plus size={16} />
              Add column
            </button>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
