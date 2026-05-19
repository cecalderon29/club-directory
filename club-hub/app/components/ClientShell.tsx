"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useTheme } from "../contexts/ThemeContext";
import { useAccount } from "../contexts/AccountContext";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarForcedHidden, setIsSidebarForcedHidden] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { accounts, currentAccount, setCurrentAccountById } = useAccount();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab =
    pathname === "/clubs"
      ? "clubs"
      : pathname === "/calendar"
      ? "calendar"
      : pathname === "/admin"
      ? "admin"
      : "home";

  const handleNavigate = useCallback((path: string) => {
    router.push(path);
    setIsSidebarOpen(false);
  }, [router]);

  useEffect(() => {
    const handleModalOpened = () => {
      setIsSidebarOpen(false);
      setIsSidebarForcedHidden(true);
    };
    const handleModalClosed = () => setIsSidebarForcedHidden(false);
    window.addEventListener('clubhub:modal-opened', handleModalOpened);
    window.addEventListener('clubhub:modal-closed', handleModalClosed);
    return () => {
      window.removeEventListener('clubhub:modal-opened', handleModalOpened);
      window.removeEventListener('clubhub:modal-closed', handleModalClosed);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/admin" && currentAccount.role !== "teacher") {
      router.replace("/dashboard");
    }
  }, [pathname, currentAccount.role, router]);

  return (
    <div className="flex h-screen font-sans transition-colors duration-300 overflow-hidden bg-(--background) text-(--foreground)">
      {!isSidebarForcedHidden && (
        <Sidebar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          activeTab={activeTab}
          onNavigate={handleNavigate}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          accounts={accounts}
          currentAccount={currentAccount}
          setCurrentAccountById={setCurrentAccountById}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 z-10 relative overflow-hidden">
        <TopBar setIsOpen={setIsSidebarOpen} currentAccount={currentAccount} />
        <main className="flex-1 overflow-hidden bg-(--background)">{children}</main>
      </div>
    </div>
  );
}
