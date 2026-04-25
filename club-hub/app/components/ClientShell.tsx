"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const activeTab =
    pathname === "/clubs" ? "clubs" : pathname === "/calendar" ? "calendar" : "home";

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("clubhub-theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      return;
    }

    if (savedTheme === "light") {
      setIsDarkMode(false);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";
    window.localStorage.setItem("clubhub-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <div className="flex h-screen font-sans transition-colors duration-300 overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeTab={activeTab}
        onNavigate={(path) => {
          router.push(path);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
      />

      <div className="flex-1 flex flex-col min-w-0 z-10 relative overflow-hidden">
        <TopBar setIsOpen={setIsSidebarOpen} isSignedIn={isSignedIn} />
        <main className="flex-1 overflow-hidden bg-[var(--background)]">{children}</main>
      </div>
    </div>
  );
}