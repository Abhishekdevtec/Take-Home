"use client";


import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { createTask, getTasks, updateTask, deleteTask, getProjects } from "@/lib/api";

// Task type for local use
type TaskType = {
  id: string;
  projectId?: string;
  project_id?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
  due_date?: string;
  assignee: string;
};

type ProjectType = {
  id: string;
  name: string;
  description?: string;
  themeColor?: string;
  theme_color?: string;
};

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
    dueDate: "",
    assignee: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load projects from API
        const projectsData = await getProjects();
        setProjects(projectsData);
        if (projectsData.length > 0) {
          setSelectedProjectId(projectsData[0].id);
        }

        // Load all tasks from all projects
        const allTasks: TaskType[] = [];
        for (const project of projectsData) {
          try {
            const projectTasks = await getTasks(project.id);
            // Map database field names to component field names
            const mappedTasks = projectTasks.map((t: any) => ({
              ...t,
              projectId: t.project_id,
              dueDate: t.due_date,
            }));
            allTasks.push(...mappedTasks);
          } catch (error) {
            console.error(`Failed to load tasks for project ${project.id}:`, error);
          }
        }
        setTasks(allTasks);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to sessionStorage
        const storedTasks = sessionStorage.getItem("taskflow_tasks");
        const storedProjects = sessionStorage.getItem("taskflow_projects");
        setTasks(storedTasks ? JSON.parse(storedTasks) : []);
        setProjects(storedProjects ? JSON.parse(storedProjects) : []);
      }
    };

    loadData();
  }, []);

  const filteredTasks = useMemo(() => tasks, [tasks]);

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    }
  };

  const handleDone = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        await updateTask(id, { status: 'Done' });
        const next = tasks.map((t) =>
          t.id === id
            ? { ...t, status: 'Done' as TaskType["status"] }
            : t
        );
        setTasks(next);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to mark task as done');
    }
  };

  const handleEdit = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status === "Done") return;
    router.push(`/dashboard?edit=${id}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <Button onClick={() => setShowModal(true)}>+ Create New Task</Button>
      </div> 
      <Modal title="Create New Task" isOpen={showModal} onClose={() => setShowModal(false)}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setFormError("");
            if (!form.title.trim() || !form.description.trim() || !form.dueDate.trim() || !form.assignee.trim()) {
              setFormError("Please fill all required fields.");
              return;
            }
            if (!selectedProjectId) {
              setFormError("Please select a project.");
              return;
            }

            try {
              const newTask = await createTask(
                selectedProjectId,
                form.title,
                form.description,
                form.status,
                form.priority,
                form.dueDate,
                form.assignee
              );
              // Map database field names to component field names
              const mappedTask = {
                ...newTask,
                projectId: newTask.project_id,
                dueDate: newTask.due_date,
              };
              setTasks([mappedTask, ...tasks]);
              setShowModal(false);
              setForm({ title: "", description: "", status: "Todo", priority: "Medium", dueDate: "", assignee: "" });
            } catch (error) {
              console.error('Failed to create task:', error);
              setFormError('Failed to create task. Please try again.');
            }
          }}
        >
          {formError && <div className="text-red-600 text-sm mb-2">{formError}</div>}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Project *</label>
            <select
              className="rounded border p-2 w-full"
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
            >
              <option value="">Select a project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <input
            className="mb-2 w-full rounded border p-2"
            placeholder="Task Title *"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <textarea
            className="mb-2 w-full rounded border p-2"
            placeholder="Description *"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <div className="flex gap-2 mb-2">
            <select
              className="rounded border p-2 flex-1"
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <select
              className="rounded border p-2 flex-1"
              value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex gap-2 mb-2">
            <input
              type="date"
              className="rounded border p-2 flex-1"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
            />
            <input
              className="rounded border p-2 flex-1"
              placeholder="Assignee (team or user) *"
              value={form.assignee}
              onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </Modal>

      {filteredTasks.length === 0 ? (
        <p className="text-slate-500">
          No tasks found. Create one from dashboard.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredTasks.map((task) => {
            const isDone = task.status === "Done";
            const project = projects.find((p) => p.id === task.projectId);
            const color = project?.themeColor || "#6366f1";

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
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: color }}
                    ></span>
                    <span className="font-semibold text-slate-900 text-lg">
                      {task.title}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-slate-100 text-xs px-2 py-1 rounded-full font-medium text-slate-700">
                      {project?.name ?? "Unknown Project"}
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
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No date"}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    disabled={isDone}
                    onClick={() => handleEdit(task.id)}
                    className="bg-indigo-500 text-white px-2 py-1 rounded disabled:bg-gray-300 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    disabled={isDone}
                    onClick={() => handleDone(task.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded disabled:bg-gray-300 text-xs"
                  >
                    Mark as Done
                  </button>

                  <button
                    disabled={isDone}
                    onClick={() => handleDelete(task.id)}
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
  );
}