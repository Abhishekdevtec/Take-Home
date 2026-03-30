"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("taskflow_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      }
    }
  }, []);

  const navItems = [
    { label: "Dashboard", route: "/dashboard" },
    { label: "Projects", route: "/projects" },
    { label: "My Tasks", route: "/tasks" },
    { label: "Team", route: "#" }, 
  ];

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("taskflow_user");
      router.replace("/");
    }
  };

  return (
    <aside className="flex flex-col justify-between border-r border-slate-200 bg-white p-6 min-h-screen">
      <div>
        <div className="mb-10 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500" />
          <div>
            <p className="text-xl font-bold text-slate-900">TaskFlow</p>
            <p className="text-xs text-slate-500">Project Workspace</p>
          </div>
        </div>
        <nav className="space-y-2 text-sm">
          {navItems.map((item) => {
            const active = pathname === item.route;
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.route)}
                className={`w-full rounded-lg px-3 py-2 text-left font-medium ${
                  active
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="rounded-xl border border-slate-200 p-4 mt-8">
        <p className="text-xs uppercase tracking-wide text-slate-500">Logged in as</p>
        <p className="mt-2 font-semibold text-slate-800">{user?.name ?? "User"}</p>
        <p className="text-xs text-slate-500">{user?.email ?? "demo@taskflow.com"}</p>
        <button
          onClick={handleLogout}
          className="mt-4 w-full rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
