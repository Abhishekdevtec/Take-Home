"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProjects, getTasks } from '@/lib/api';

type TaskType = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
  due_date?: string;
  assignee: string;
};

export default function TaskPage({ params }: { params: { id: string } }) {
  const [task, setTask] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        const projectsData = await getProjects();
        
        // Search for task in all projects
        for (const project of projectsData) {
          try {
            const tasks = await getTasks(project.id);
            const found = tasks.find((t: any) => t.id === params.id);
            if (found) {
              // Map database field names to component field names
              const mappedTask: TaskType = {
                ...found,
                dueDate: found.due_date,
              };
              setTask(mappedTask);
              return;
            }
          } catch (error) {
            console.error(`Failed to load tasks for project ${project.id}:`, error);
          }
        }
        
        // Fallback to sessionStorage
        const stored = sessionStorage.getItem('taskflow_tasks');
        if (stored) {
          try {
            const tasks: TaskType[] = JSON.parse(stored);
            const found = tasks.find((t) => t.id === params.id);
            if (found) setTask(found);
          } catch {}
        }
      } catch (error) {
        console.error('Failed to load task:', error);
        // Try sessionStorage as fallback
        const stored = sessionStorage.getItem('taskflow_tasks');
        if (stored) {
          try {
            const tasks: TaskType[] = JSON.parse(stored);
            const found = tasks.find((t) => t.id === params.id);
            if (found) setTask(found);
          } catch {}
        }
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Task not found</h1>
          <p className="mt-2 text-slate-600">The task URL is invalid or it has been deleted.</p>
          <Link href="/tasks" className="mt-4 inline-block text-blue-600">Back to tasks</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{task.status}</span>
        </div>

        <p className="text-sm text-slate-500">Priority: {task.priority}</p>
        <p className="text-sm text-slate-500">Due date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}</p>
        <p className="mt-2 text-sm text-slate-500">Assignee: {task.assignee}</p>

        <section className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-lg font-bold text-slate-900">Description</h2>
          <p className="mt-2 text-sm text-slate-700">{task.description}</p>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/tasks" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Back to tasks</Link>
          <Link href="/dashboard" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Back to dashboard</Link>
        </div>
      </div>
    </div>
  );
}
