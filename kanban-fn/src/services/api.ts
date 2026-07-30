type Project = {
  id: string;
  name: string;
  description?: string | null;
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  columnId: string;
  projectId: string;
};

type Column = {
  id: string;
  name: string;
  order: number;
  tasks: Task[];
};

type Board = {
  id: string;
  name: string;
  description?: string | null;
  columns: Column[];
  tasks: Task[];
};

const DEMO_PROJECTS_KEY = 'taskflow_demo_projects';

function readProjects(): Project[] {
  const stored = window.localStorage.getItem(DEMO_PROJECTS_KEY);
  if (!stored) {
    return [
      {
        id: 'project-1',
        name: 'Product Launch',
        description: 'Coordinate the launch checklist and deliverables.',
      },
    ];
  }

  return JSON.parse(stored) as Project[];
}

function writeProjects(projects: Project[]) {
  window.localStorage.setItem(DEMO_PROJECTS_KEY, JSON.stringify(projects));
}

function readBoard(projectId: string): Board {
  const projects = readProjects();
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  const columns: Column[] = [
    {
      id: 'todo',
      name: 'To Do',
      order: 1,
      tasks: [
        {
          id: 'task-1',
          title: 'Define scope',
          description: 'Gather requirements from stakeholders.',
          priority: 'HIGH',
          columnId: 'todo',
          projectId,
        },
      ],
    },
    {
      id: 'doing',
      name: 'In Progress',
      order: 2,
      tasks: [],
    },
    {
      id: 'done',
      name: 'Done',
      order: 3,
      tasks: [],
    },
  ];

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    columns,
    tasks: columns.flatMap((column) => column.tasks),
  };
}

export async function getProjects() {
  return Promise.resolve(readProjects());
}

export async function createProject(name: string, description?: string) {
  const project: Project = {
    id: `project-${Date.now()}`,
    name,
    description,
  };

  const projects = [...readProjects(), project];
  writeProjects(projects);
  return Promise.resolve(project);
}

export async function getProjectBoard(projectId: string) {
  return Promise.resolve(readBoard(projectId));
}

export async function createColumn(projectId: string, name: string, order: number) {
  const board = readBoard(projectId);
  const column: Column = {
    id: `column-${Date.now()}`,
    name,
    order,
    tasks: [],
  };

  board.columns.push(column);
  return Promise.resolve(column);
}

export async function createTask(payload: { title: string; description?: string; priority: string; columnId: string; projectId: string; assignedToId?: string }) {
  const board = readBoard(payload.projectId);
  const task: Task = {
    id: `task-${Date.now()}`,
    title: payload.title,
    description: payload.description,
    priority: payload.priority,
    columnId: payload.columnId,
    projectId: payload.projectId,
  };

  const targetColumn = board.columns.find((column) => column.id === payload.columnId);
  if (targetColumn) {
    targetColumn.tasks.push(task);
  }

  return Promise.resolve(task);
}

export async function moveTask(taskId: string, columnId: string) {
  const stored = window.sessionStorage.getItem('dragTaskId');
  if (stored) {
    window.sessionStorage.removeItem('dragTaskId');
  }
  return Promise.resolve({ id: taskId, columnId });
}
