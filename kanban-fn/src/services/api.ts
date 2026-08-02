export type Task = {
  id: string;
  title: string;
  description?: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  columnId: string;
  projectId: string;
  dueDate?: string | null;
  estimatedHours?: number | null;
  assignedToId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Column = {
  id: string;
  name: string;
  order: number;
  projectId?: string;
  tasks: Task[];
  createdAt?: string;
  updatedAt?: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
  columns?: Column[];
  tasks?: Task[];
};

export type Board = Project & { columns: Column[] };

export type User = { id: string; name: string; email: string };
export type AuthResponse = { user: User; token: string };

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://kanban-bn-platform-1.onrender.com/api';
const SESSION_KEY = 'taskflow_session';

function readSession(): AuthResponse | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
}

function getToken() {
  return readSession()?.token ?? null;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const errorData = data as { message?: string; error?: string } | null;
    const message = errorData?.message || errorData?.error || response.statusText || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

function withTaskArrays(column: Column, tasks: Task[] = []): Column {
  return { ...column, tasks };
}

async function hydrateColumns(projectId: string): Promise<Column[]> {
  const columns = await getColumns(projectId);
  const hydrated = await Promise.all(
    columns.map(async (column) => withTaskArrays(column, await getTasksByColumn(column.id)))
  );
  return hydrated.sort((a, b) => a.order - b.order);
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string): Promise<{ user: User; message?: string }> {
  return request<{ user: User; message?: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getProjects(): Promise<Project[]> {
  return request<Project[]>('/projects');
}

export async function getProject(projectId: string): Promise<Project> {
  return request<Project>(`/projects/${projectId}`);
}

export async function createProject(name: string, description?: string): Promise<Project> {
  const project = await request<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });

  const defaultColumns = [
    { name: 'To Do', order: 1 },
    { name: 'In Progress', order: 2 },
    { name: 'Done', order: 3 },
  ];

  await Promise.all(defaultColumns.map((column) => createColumn(project.id, column.name, column.order)));

  return { ...project, columns: [] };
}

export async function updateProject(projectId: string, data: { name?: string; description?: string }): Promise<Project> {
  return request<Project>(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await request<void>(`/projects/${id}`, { method: 'DELETE' });
}

export async function getProjectBoard(projectId: string): Promise<Board> {
  const project = await getProject(projectId);
  const columns = await hydrateColumns(projectId);
  return { ...project, columns };
}

export async function getColumns(projectId: string): Promise<Column[]> {
  return request<Column[]>(`/columns/project/${projectId}`);
}

export async function createColumn(projectId: string, name: string, order: number): Promise<Column> {
  return request<Column>('/columns', {
    method: 'POST',
    body: JSON.stringify({ projectId, name, order }),
  });
}

export async function updateColumn(columnId: string, data: { name?: string; order?: number }): Promise<Column> {
  return request<Column>(`/columns/${columnId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteColumn(columnId: string): Promise<void> {
  await request<void>(`/columns/${columnId}`, { method: 'DELETE' });
}

export async function getTask(taskId: string): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`);
}

export async function getTasksByColumn(columnId: string): Promise<Task[]> {
  return request<Task[]>(`/tasks/column/${columnId}`);
}

export async function createTask(payload: {
  title: string;
  description?: string;
  priority: string;
  columnId: string;
  projectId: string;
  dueDate?: string;
  estimatedHours?: number;
}): Promise<Task> {
  return request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify({
      projectId: payload.projectId,
      columnId: payload.columnId,
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      dueDate: payload.dueDate ?? null,
      estimatedHours: payload.estimatedHours ?? null,
    }),
  });
}

export async function moveTask(taskId: string, fromColumnId: string, toColumnId: string, projectId?: string): Promise<void> {
  await request<void>(`/tasks/${taskId}/move`, {
    method: 'PUT',
    body: JSON.stringify({ columnId: toColumnId, fromColumnId, projectId }),
  });
}

export async function updateTask(taskId: string, columnId: string, projectId: string, data: {
  title: string;
  description?: string;
  priority: string;
  dueDate?: string;
  estimatedHours?: number;
}): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify({
      columnId,
      projectId,
      ...data,
      dueDate: data.dueDate ?? null,
      estimatedHours: data.estimatedHours ?? null,
    }),
  });
}

export async function deleteTask(taskId: string, _columnId: string, _projectId: string): Promise<void> {
  await request<void>(`/tasks/${taskId}`, { method: 'DELETE' });
}

export type TaskWithMeta = Task & { projectName: string; columnName: string };

export async function getAllTasks(): Promise<TaskWithMeta[]> {
  const projects = await getProjects();
  const result: TaskWithMeta[] = [];

  await Promise.all(
    projects.map(async (project) => {
      const columns = project.columns?.length ? project.columns : await hydrateColumns(project.id);
      for (const column of columns) {
        const tasks = column.tasks?.length ? column.tasks : await getTasksByColumn(column.id);
        for (const task of tasks) {
          result.push({ ...task, projectName: project.name, columnName: column.name });
        }
      }
    })
  );

  return result;
}
