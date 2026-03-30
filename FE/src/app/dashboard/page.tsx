"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import Modal from '@/components/ui/modal';
import { createProject, getProjects } from '@/lib/api';

type ProjectType = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectError, setProjectError] = useState("");
  const [themeColor, setThemeColor] = useState("#6366f1"); // default indigo
  const [dueDate, setDueDate] = useState("");
  // Team member selection removed

  useEffect(() => {
    const stored = sessionStorage.getItem('taskflow_user');
    if (!stored) {
      router.replace('/');
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      router.replace('/');
    }
    
    // Load projects from API
    const loadProjects = async () => {
      try {
        const projectsData = await getProjects();
        const mappedProjects = projectsData.map((p: any) => ({
          ...p,
          themeColor: p.theme_color,
          dueDate: p.due_date,
          createdAt: p.created_at || new Date().toISOString(),
        }));
        setProjects(mappedProjects);
      } catch (error) {
        console.error('Failed to load projects:', error);
        // Fallback to sessionStorage
        const projectStorage = sessionStorage.getItem('taskflow_projects');
        if (projectStorage) {
          try {
            setProjects(JSON.parse(projectStorage));
          } catch {
            setProjects([]);
          }
        }
      }
    };
    
    loadProjects();
  }, [router]);


  const handleProjectCreate = () => {
    setShowProjectModal(true);
  };

  const handleCreateProject = async () => {
    setProjectError("");
    if (!projectName.trim()) {
      setProjectError("Project name is required");
      return;
    }
    
    try {
      const newProject = await createProject(projectName, projectDescription);
      const mappedProject = {
        ...newProject,
        themeColor,
        dueDate,
      };
      const updated = [mappedProject, ...projects];
      setProjects(updated);
      setShowProjectModal(false);
      setProjectName("");
      setProjectDescription("");
      setThemeColor("#6366f1");
      setDueDate("");
      setProjectError("");
      setAlert({ message: 'Project created successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to create project:', error);
      setProjectError('Failed to create project. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('taskflow_user');
    router.replace('/');
  };

  return (
    <>
      <main className="relative p-6 xl:p-10">
        {alert && <Alert message={alert.message} type={alert.type} />}
        <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
          <div className="h-7 w-7 rounded-full bg-slate-300" />
          <span className="text-sm font-medium text-slate-700">{user?.name?.split(' ')[0] ?? 'User'}</span>
        </div>
          <div className="mb-8 pt-10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-600">Manage your projects and details across all teams.</p>
            </div>
            <Button onClick={handleProjectCreate}>+ Create New Project</Button>
                {/* Create Project Modal */}
                <Modal
                  title="Create New Project"
                  isOpen={showProjectModal}
                  onClose={() => setShowProjectModal(false)}
                >
                  <div className="p-1 sm:p-2">
                    <p className="text-slate-500 mb-4">Organize tasks under a new project workspace.</p>
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
                    {/* Team Members removed */}
                    {projectError && <p className="text-red-500 text-sm mb-2">{projectError}</p>}
                    <div className="flex justify-end gap-2 mt-6">
                      <Button variant="secondary" onClick={() => setShowProjectModal(false)}>Cancel</Button>
                      <Button onClick={handleCreateProject} className="bg-indigo-600 hover:bg-indigo-700">Create Project</Button>
                    </div>
                  </div>
                </Modal>
          </div>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">Total Projects</p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-3xl font-bold text-slate-900">{projects.length}</span>
              </div>
            </article>
          </section>
          <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Quick Project Overview</h2>
            <p className="text-sm text-slate-600">You have {projects.length} project(s). Go to Projects for full project cards and actions.</p>
            <button onClick={() => router.push('/projects')} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              View Projects
            </button>
          </section>
        </main>
      </>
  );
}

