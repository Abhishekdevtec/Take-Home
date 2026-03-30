"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProjectById } from '@/lib/api';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';

// Types
interface TaskType {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee?: string;
}

interface ProjectType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    id: '',
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '',
    assignee: '',
  });
  const [taskError, setTaskError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  // ...existing code moved inside component...

  useEffect(() => {
    setLoading(true);
    const storedProjects = sessionStorage.getItem('taskflow_projects');
    const storedTasks = sessionStorage.getItem('taskflow_tasks');
    const projects: ProjectType[] = storedProjects ? JSON.parse(storedProjects) : [];
    const tasks: TaskType[] = storedTasks ? JSON.parse(storedTasks) : [];
    let found = projects.find((p) => p.id === projectId);
    if (!found && projectId) {
      // Fetch from backend if not found in sessionStorage
      getProjectById(projectId as string)
        .then((data) => {
          setProject(data);
          setLoading(false);
        })
        .catch(() => {
          setProject(null);
          setLoading(false);
        });
    } else {
      setProject(found || null);
      setLoading(false);
    }
    setTasks(tasks.filter((t) => t.projectId === projectId));
  }, [projectId]);

  function saveTasks(next: TaskType[]) {
    setTasks(next);
    const allTasksRaw = sessionStorage.getItem('taskflow_tasks');
    let allTasks: TaskType[] = allTasksRaw ? JSON.parse(allTasksRaw) : [];
    // Remove tasks for this project
    allTasks = allTasks.filter((t) => t.projectId !== projectId);
    // Add updated tasks for this project
    allTasks = [...allTasks, ...next];
    sessionStorage.setItem('taskflow_tasks', JSON.stringify(allTasks));
  }

  const handleCreateOrEditTask = () => {
    setTaskError('');
    if (!taskForm.title.trim() || !taskForm.description.trim() || !taskForm.dueDate.trim()) {
      setTaskError('Please fill all required fields.');
      return;
    }
    if (isEdit && taskForm.id) {
      // Edit existing task
      const updatedTasks = tasks.map((t) =>
        t.id === taskForm.id ? {
          ...t,
          title: taskForm.title,
          description: taskForm.description,
          status: taskForm.status,
          priority: taskForm.priority,
          dueDate: taskForm.dueDate,
          assignee: taskForm.assignee,
        } : t
      );
      saveTasks(updatedTasks);
    } else {
      // Create new task
      const newTask: TaskType = {
        id: Date.now().toString(),
        projectId: projectId as string,
        title: taskForm.title,
        description: taskForm.description,
        status: taskForm.status,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate,
        assignee: taskForm.assignee,
      };
      const next = [...tasks, newTask];
      saveTasks(next);
    }
    setShowTaskModal(false);
    setIsEdit(false);
    setTaskForm({
      id: '',
      title: '',
      description: '',
      status: 'Todo',
      priority: 'Medium',
      dueDate: '',
      assignee: '',
    });
  };

  const handleDeleteTask = (id: string) => {
    const next = tasks.filter((t) => t.id !== id);
    saveTasks(next);
  };

  const handleMarkDone = (id: string) => {
    const next = tasks.map((t) => t.id === id ? { ...t, status: 'Done' } : t);
    saveTasks(next);
  };

  const handleEditTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setTaskForm({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee || '',
    });
    setIsEdit(true);
    setShowTaskModal(true);
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <div>Loading project...</div>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-500">
        <div>
          <h2 className="text-2xl font-bold mb-2">Project not found</h2>
          <button className="text-blue-600 underline" onClick={() => router.push('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-slate-600">{project.description}</p>
          </div>
          <Button onClick={() => {
            setShowTaskModal(true);
            setIsEdit(false);
            setTaskForm({
              id: '',
              title: '',
              description: '',
              status: 'Todo',
              priority: 'Medium',
              dueDate: '',
              assignee: '',
            });
          }}>
            Create New Task
          </Button>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-slate-500">No tasks for this project yet.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => {
                const isDone = task.status === "Done";
                return (
                  <article
                    key={task.id}
                    className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition flex flex-col justify-between min-h-[180px] group ${
                      isDone
                        ? "opacity-60 pointer-events-none select-none grayscale"
                        : "hover:shadow-md"
                    }`}
                    tabIndex={isDone ? -1 : 0}
                    aria-disabled={isDone}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="h-3 w-3 rounded-full bg-indigo-400"></span>
                        <span className="font-semibold text-slate-900 text-lg">
                          {task.title}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="bg-slate-100 text-xs px-2 py-1 rounded-full font-medium text-slate-700">
                          {task.priority} Priority
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full font-semibold text-xs ${
                            isDone
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {isDone ? "Done" : task.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <span className="inline-block h-5 w-5 rounded-full bg-slate-200 text-slate-500 text-base flex items-center justify-center">👤</span>
                        {task.assignee || "Unassigned"}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        disabled={isDone}
                        onClick={() => handleEditTask(task.id)}
                        className="bg-indigo-500 text-white px-2 py-1 rounded disabled:bg-gray-300 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        disabled={isDone}
                        onClick={() => handleMarkDone(task.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded disabled:bg-gray-300 text-xs"
                      >
                        Mark as Done
                      </button>
                      <button
                        disabled={isDone}
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
        <Modal isOpen={showTaskModal} onClose={() => { setShowTaskModal(false); setIsEdit(false); }} title={isEdit ? "Edit Task" : "Create New Task"}>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleCreateOrEditTask();
            }}
          >
            <div className="p-0">
              <div className="px-6 pt-2 pb-2"> 
                <p className="text-slate-500 text-sm mb-4">{isEdit ? 'Edit your task' : 'Add a task to your project'}</p>
                {taskError && <p className="text-red-600 text-sm mb-2">{taskError}</p>}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Task Title <span className="text-rose-500">*</span></label>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter task title"
                    value={taskForm.title}
                    onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter task description"
                    value={taskForm.description}
                    onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Assignee</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Enter assignee name"
                    value={taskForm.assignee}
                    onChange={e => setTaskForm(f => ({ ...f, assignee: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">Status</label>
                    <select
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      value={taskForm.status}
                      onChange={e => setTaskForm(f => ({ ...f, status: e.target.value }))}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">Priority</label>
                    <select
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      value={taskForm.priority}
                      onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">Due Date</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      value={taskForm.dueDate}
                      onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))}
                    />
                  </div> 
                </div>
              </div>
              <div className="flex justify-end gap-2 bg-slate-50 px-6 py-4 rounded-b-2xl border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={() => { setShowTaskModal(false); setIsEdit(false); }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  {isEdit ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
