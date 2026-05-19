"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useTheme } from "../contexts/ThemeContext";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { isDarkMode, setIsDarkMode } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab =
    pathname === "/clubs" ? "clubs" : pathname === "/calendar" ? "calendar" : "home";

  const handleNavigate = useCallback((path: string) => {
    router.push(path);
    setIsSidebarOpen(false);
  }, [router]);

  useEffect(() => {
    const handleModalOpen = () => setIsSidebarOpen(false);
    window.addEventListener('club-modal-opened', handleModalOpen);
    return () => window.removeEventListener('club-modal-opened', handleModalOpen);
  }, []);

  return (
    <div className="flex h-screen font-sans transition-colors duration-300 overflow-hidden bg-(--background) text-(--foreground)">
      <Sidebar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
      />

      <div className="flex-1 flex flex-col min-w-0 z-10 relative overflow-hidden">
        <TopBar setIsOpen={setIsSidebarOpen} isSignedIn={isSignedIn} />
        <main className="flex-1 overflow-hidden bg-(--background)">{children}</main>
      </div>
    </div>
  );
}
