"use client";


import Link from 'next/link';
import { useEffect, useState } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';
import { createProject, getProjects, updateProject, deleteProject } from '@/lib/api';

type ProjectType = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  themeColor?: string;
  dueDate?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'Archived'>('All');
  const [page, setPage] = useState(1);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [themeColor, setThemeColor] = useState("#6366f1");
  const [dueDate, setDueDate] = useState("");
  const [projectError, setProjectError] = useState("");
  const [editId, setEditId] = useState<string|null>(null);
  const pageSize = 8;
  // Removed modal and form state, now handled in dashboard

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        // Map database field names to component field names
        const mappedProjects = data.map((p: any) => ({
          ...p,
          themeColor: p.theme_color,
          dueDate: p.due_date,
          createdAt: p.created_at || new Date().toISOString(),
        }));
        setProjects(mappedProjects);
        // Also try to get tasks from sessionStorage as fallback
        const storedTasks = sessionStorage.getItem('taskflow_tasks');
        setTasks(storedTasks ? JSON.parse(storedTasks) : []);
      } catch (error) {
        console.error('Failed to load projects:', error);
        // Fallback to sessionStorage
        const stored = sessionStorage.getItem('taskflow_projects');
        setProjects(stored ? JSON.parse(stored) : []);
      }
    };

    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditId(null);
    setProjectName("");
    setProjectDescription("");
    setThemeColor("#6366f1");
    setDueDate("");
    setProjectError("");
    setShowProjectModal(true);
  };

  const openEditModal = (project: ProjectType) => {
    setEditId(project.id);
    setProjectName(project.name);
    setProjectDescription(project.description);
    setThemeColor(project.themeColor || "#6366f1");
    setDueDate(project.dueDate || "");
    setProjectError("");
    setShowProjectModal(true);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  const handleMarkDoneProject = async (id: string) => {
    try {
      const project = projects.find(p => p.id === id);
      if (project) {
        await updateProject(id, project.name + ' (Done)', project.description);
        const updated = projects.map(p => p.id === id ? { ...p, name: p.name + ' (Done)' } : p);
        setProjects(updated);
      }
    } catch (error) {
      console.error('Failed to mark project as done:', error);
      alert('Failed to mark project as done');
    }
  };

  const handleCreateOrEditProject = async () => {
    setProjectError("");
    if (!projectName.trim()) {
      setProjectError("Project name is required");
      return;
    }
    
    try {
      if (editId) {
        // Edit
        await updateProject(editId, projectName, projectDescription);
        const updated = projects.map(p => p.id === editId ? { ...p, name: projectName, description: projectDescription, themeColor, dueDate } : p);
        setProjects(updated);
      } else {
        // Create
        const newProject = await createProject(projectName, projectDescription);
        const mappedProject = {
          ...newProject,
          themeColor,
          dueDate,
        };
        const updated = [mappedProject, ...projects];
        setProjects(updated);
      }
      setShowProjectModal(false);
      setProjectName("");
      setProjectDescription("");
      setThemeColor("#6366f1");
      setDueDate("");
      setEditId(null);
    } catch (error) {
      console.error('Failed to save project:', error);
      setProjectError('Failed to save project. Please try again.');
    }
  };

  // Simulate status for demo (randomly assign for now)
  const getStatus = (project: ProjectType) => {
    const statuses = ['Active', 'Completed', 'Archived'];
    // Use createdAt to get a stable status
    const idx = parseInt(project.id, 10) % statuses.length;
    return statuses[idx];
  };

  // Filtered projects
  const filtered = filter === 'All' ? projects : projects.filter(p => getStatus(p) === filter);
  const total = filtered.length;
  const totalAll = projects.length;
  const totalActive = projects.filter(p => getStatus(p) === 'Active').length;
  const totalCompleted = projects.filter(p => getStatus(p) === 'Completed').length;
  const totalArchived = projects.filter(p => getStatus(p) === 'Archived').length;

  // Pagination
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const paginated = filtered.slice(startIdx, endIdx);
  const totalPages = Math.ceil(total / pageSize);

  // Removed handleCreate, now handled in dashboard

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-slate-600 text-sm">Manage and track all your team's projects.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg px-3 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700" onClick={openCreateModal}>+ New Project</button>
          </div>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => { setFilter('All'); setPage(1); }} className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'All' ? 'bg-gray-200 text-slate-900 border border-gray-400' : 'bg-gray-100 text-slate-700'}`}>All Projects <span className="ml-1 text-xs font-semibold">{totalAll}</span></button>
          <button onClick={() => { setFilter('Active'); setPage(1); }} className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'Active' ? 'bg-gray-200 text-slate-900 border border-gray-400' : 'bg-gray-100 text-slate-700'}`}>Active <span className="ml-1 text-xs font-semibold">{totalActive}</span></button>
          <button onClick={() => { setFilter('Completed'); setPage(1); }} className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'Completed' ? 'bg-gray-200 text-slate-900 border border-gray-400' : 'bg-gray-100 text-slate-700'}`}>Completed <span className="ml-1 text-xs font-semibold">{totalCompleted}</span></button>
          <button onClick={() => { setFilter('Archived'); setPage(1); }} className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'Archived' ? 'bg-gray-200 text-slate-900 border border-gray-400' : 'bg-gray-100 text-slate-700'}`}>Archived <span className="ml-1 text-xs font-semibold">{totalArchived}</span></button>
        </div>
        {/* Project Cards */}
        {paginated.length === 0 ? (
          <p className="text-slate-500">No projects found for this filter.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {paginated.map((project) => {
              const status = getStatus(project);
              const color = project.themeColor || '#6366f1';
              const due = project.dueDate ? new Date(project.dueDate) : null;
              // Real progress from tasks
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const totalTasks = projectTasks.length;
              const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
              const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
              // Simulate tags
              const tags = [
                ...(status === 'Active' ? ['Engineering', 'Mobile'] : []),
                ...(status === 'Completed' ? ['Design', 'Marketing'] : []),
                ...(status === 'Archived' ? ['Content'] : []),
              ];
              // Simulate priority
              const priority = status === 'Active' ? 'Medium' : status === 'Completed' ? 'High' : 'Low';
              return (
                <article
                  key={project.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[220px] group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: color }}></span>
                    <span className="font-semibold text-slate-900 text-lg cursor-pointer hover:underline" onClick={() => window.location.href = `/projects/${project.id}`}>{project.name}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-6 line-clamp-2">{project.description}</p>
                  {/* <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                      <span key={tag} className="bg-slate-100 text-xs px-2 py-1 rounded-full font-medium text-slate-700">{tag}</span>
                    ))}
                  </div> */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-semibold text-slate-700">{completedTasks}/{totalTasks} tasks</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-2 rounded-full" style={{ width: `${progress}%`, background: color }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500"><svg width="16" height="16" fill="none"><rect width="16" height="16" rx="4" fill="#f3f4f6"/><path d="M4 8h8M4 11h5" stroke="#a3a3a3" strokeWidth="1.2" strokeLinecap="round"/></svg></span>
                      <span>{due ? due.toLocaleDateString() : 'No date'}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full font-semibold text-xs ${priority === 'High' ? 'bg-rose-100 text-rose-600' : priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}>{priority}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="secondary" onClick={() => openEditModal(project)} className="text-xs">Edit</Button>
                    <Button variant="secondary" onClick={() => handleDeleteProject(project.id)} className="text-xs text-red-600">Delete</Button>
                    <Button variant="secondary" onClick={() => handleMarkDoneProject(project.id)} className="text-xs text-green-600">Mark as Done</Button>
                  </div>
                        {/* Create/Edit Project Modal */}
                        <Modal
                          title={editId ? "Edit Project" : "Create New Project"}
                          isOpen={showProjectModal}
                          onClose={() => setShowProjectModal(false)}
                        >
                          <div className="p-1 sm:p-2">
                            <div className="mb-3">
                              <label className="block text-sm font-medium mb-1">Project Name <span className="text-red-500">*</span></label>
                              <input
                                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                value={projectName}
                                onChange={e => setProjectName(e.target.value)}
                                placeholder="e.g. Website Redesign"
                              />
                            </div>
                            <div className="mb-3">
                              <label className="block text-sm font-medium mb-1">Description</label>
                              <textarea
                                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                value={projectDescription}
                                onChange={e => setProjectDescription(e.target.value)}
                                placeholder="Briefly describe the goals of this project..."
                                rows={2}
                              />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mb-3">
                              <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Theme Color</label>
                                <div className="flex gap-2 mt-1">
                                  {["#6366f1", "#22c55e", "#f59e42", "#ef4444", "#f43f5e", "#0f172a"].map(color => (
                                    <button
                                      key={color}
                                      type="button"
                                      className={`h-6 w-6 rounded-full border-2 ${themeColor === color ? 'border-indigo-600' : 'border-white'} focus:outline-none`}
                                      style={{ background: color }}
                                      onClick={() => setThemeColor(color)}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Due Date</label>
                                <input
                                  type="date"
                                  className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                  value={dueDate}
                                  onChange={e => setDueDate(e.target.value)}
                                  placeholder="Select date"
                                />
                              </div>
                            </div>
                            {projectError && <p className="text-red-500 text-sm mb-2">{projectError}</p>}
                            <div className="flex justify-end gap-2 mt-6">
                              <Button variant="secondary" onClick={() => setShowProjectModal(false)}>Cancel</Button>
                              <Button onClick={handleCreateOrEditProject} className="bg-indigo-600 hover:bg-indigo-700">{editId ? 'Save Changes' : 'Create Project'}</Button>
                            </div>
                          </div>
                        </Modal>
                </article>
              );
            })}
          </div>
        )}
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 text-sm">
          <span>Showing {startIdx + 1} to {Math.min(endIdx, total)} of {total} projects</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-slate-100 disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >Previous</button>
            <button
              className="px-3 py-1 rounded bg-slate-100 disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
