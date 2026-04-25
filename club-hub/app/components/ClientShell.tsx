"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="flex h-screen font-sans transition-colors duration-300 overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
      />

      <div className="flex-1 flex flex-col min-w-0 z-10 relative overflow-hidden">
        <TopBar setIsOpen={setIsSidebarOpen} isSignedIn={isSignedIn} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}