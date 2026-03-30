// Get a single project by ID
export function getProjectById(id: string) {
  return apiCall(`/projects/${id}`, {
    method: 'GET',
  });
}
const API_BASE_URL = 'http://localhost:5050';

export async function apiCall(
  endpoint: string,
  options: RequestInit & { method?: string } = {}
) {

  const url = `${API_BASE_URL}${endpoint}`;
  const token = sessionStorage.getItem('taskflow_token');

  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Do not send token for login or register endpoints
  const isAuthEndpoint = endpoint === '/auth/login' || endpoint === '/auth/register';
  if (token && !isAuthEndpoint) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// Auth APIs
export function login(email: string, password: string) {
  return apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(email: string, password: string, name: string) {
  return apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

// Project APIs
export function createProject(name: string, description: string) {
  return apiCall('/projects', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
}

export function getProjects() {
  return apiCall('/projects', {
    method: 'GET',
  });
}

export function updateProject(
  id: string,
  name: string,
  description: string
) {
  return apiCall(`/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name, description }),
  });
}

export function deleteProject(id: string) {
  return apiCall(`/projects/${id}`, {
    method: 'DELETE',
  });
}

// Task APIs
export function createTask(
  projectId: string,
  title: string,
  description: string,
  status?: string,
  priority?: string,
  dueDate?: string,
  assignee?: string
) {
  return apiCall(`/projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      status,
      priority,
      dueDate,
      assignee,
    }),
  });
}

export function getTasks(projectId: string) {
  return apiCall(`/projects/${projectId}/tasks`, {
    method: 'GET',
  });
}

export function updateTask(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    assignee: string;
  }>
) {
  return apiCall(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteTask(id: string) {
  return apiCall(`/tasks/${id}`, {
    method: 'DELETE',
  });
}
