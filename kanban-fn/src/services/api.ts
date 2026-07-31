export type Task = {
  id: string;
  title: string;
  description?: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  columnId: string;
  projectId: string;
};

export type Column = {
  id: string;
  name: string;
  order: number;
  tasks: Task[];
};

export type Project = {
  id: string;
  name: string;
  description?: string | null;
};

export type Board = Project & { columns: Column[] };

const PROJECTS_KEY = 'taskflow_projects';
const BOARDS_KEY = 'taskflow_boards';

function loadProjects(): Project[] {
  const raw = localStorage.getItem(PROJECTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function loadBoards(): Record<string, Column[]> {
  const raw = localStorage.getItem(BOARDS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveBoards(boards: Record<string, Column[]>) {
  localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
}

export async function getProjects(): Promise<Project[]> {
  return loadProjects();
}

export async function createProject(name: string, description?: string): Promise<Project> {
  const project: Project = { id: `proj-${Date.now()}`, name, description };
  const projects = [...loadProjects(), project];
  saveProjects(projects);

  // seed default columns
  const boards = loadBoards();
  boards[project.id] = [
    { id: `col-${Date.now()}-1`, name: 'To Do', order: 1, tasks: [] },
    { id: `col-${Date.now()}-2`, name: 'In Progress', order: 2, tasks: [] },
    { id: `col-${Date.now()}-3`, name: 'Done', order: 3, tasks: [] },
  ];
  saveBoards(boards);
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  saveProjects(loadProjects().filter((p) => p.id !== id));
  const boards = loadBoards();
  delete boards[id];
  saveBoards(boards);
}

export async function getProjectBoard(projectId: string): Promise<Board> {
  const project = loadProjects().find((p) => p.id === projectId);
  if (!project) throw new Error('Project not found');
  const boards = loadBoards();
  const columns = boards[projectId] ?? [];
  return { ...project, columns };
}

export async function createColumn(projectId: string, name: string, order: number): Promise<Column> {
  const boards = loadBoards();
  const column: Column = { id: `col-${Date.now()}`, name, order, tasks: [] };
  boards[projectId] = [...(boards[projectId] ?? []), column];
  saveBoards(boards);
  return column;
}

export async function deleteColumn(projectId: string, columnId: string): Promise<void> {
  const boards = loadBoards();
  boards[projectId] = (boards[projectId] ?? []).filter((c) => c.id !== columnId);
  saveBoards(boards);
}

export async function createTask(payload: {
  title: string;
  description?: string;
  priority: string;
  columnId: string;
  projectId: string;
}): Promise<Task> {
  const task: Task = {
    id: `task-${Date.now()}`,
    title: payload.title,
    description: payload.description,
    priority: payload.priority as Task['priority'],
    columnId: payload.columnId,
    projectId: payload.projectId,
  };
  const boards = loadBoards();
  boards[payload.projectId] = (boards[payload.projectId] ?? []).map((col) =>
    col.id === payload.columnId ? { ...col, tasks: [...col.tasks, task] } : col
  );
  saveBoards(boards);
  return task;
}

export async function moveTask(taskId: string, fromColumnId: string, toColumnId: string, projectId: string): Promise<void> {
  const boards = loadBoards();
  const columns = boards[projectId] ?? [];
  let movedTask: Task | undefined;
  const updated = columns.map((col) => {
    if (col.id === fromColumnId) {
      movedTask = col.tasks.find((t) => t.id === taskId);
      return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
    }
    return col;
  });
  if (movedTask) {
    const final = updated.map((col) =>
      col.id === toColumnId ? { ...col, tasks: [...col.tasks, { ...movedTask!, columnId: toColumnId }] } : col
    );
    boards[projectId] = final;
    saveBoards(boards);
  }
}

export async function deleteTask(taskId: string, columnId: string, projectId: string): Promise<void> {
  const boards = loadBoards();
  boards[projectId] = (boards[projectId] ?? []).map((col) =>
    col.id === columnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col
  );
  saveBoards(boards);
}
