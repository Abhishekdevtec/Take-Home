"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  // Show sidebar only if logged in and on allowed pages
  const sidebarRoutes = [
    "/dashboard",
    "/projects",
    "/tasks"
  ];
  // Also match dynamic routes like /projects/:id and /tasks/:id
  const showSidebar =
    mounted &&
    user &&
    (sidebarRoutes.some((route) => pathname === route) ||
      pathname.startsWith("/projects/") ||
      pathname.startsWith("/tasks/"));

  if (!mounted) {
    return <main className="p-6 w-full">{children}</main>;
  }

  return (
    <div className={showSidebar ? "grid min-h-screen grid-cols-1 xl:grid-cols-[280px_1fr]" : ""}>
      {showSidebar && <Sidebar />}
      <main className="p-6 w-full">{children}</main>
    </div>
  );
}
