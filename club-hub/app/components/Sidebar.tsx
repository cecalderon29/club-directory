import React from 'react';
import {
  Home,
  Users,
  Calendar as CalendarIcon,
  Shield,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import NavItem from './NavItem';
import { DemoAccount } from '../contexts/AccountContext';
import { canAccessAdmin } from '@/lib/demo-auth';

interface SidebarProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  accounts: DemoAccount[];
  currentAccount: DemoAccount;
  setCurrentAccountById: (id: string) => void;
}

/**
 * Sidebar Component
 */
const SidebarComponent: React.FC<SidebarProps> = ({
  isDarkMode,
  setIsDarkMode,
  activeTab,
  onNavigate,
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
  accounts,
  currentAccount,
  setCurrentAccountById,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        bg-(--surface) border-(--border) text-(--text-primary)
        flex flex-col border-r h-full backdrop-blur-xl
      `}>
        <div className={`p-4 mb-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2">
            <div className="bg-(--accent) text-(--text-inverse) p-1.5 rounded-lg shadow-md">
              <Users size={18} strokeWidth={3} />
            </div>
            {!isCollapsed && (
              <h1 className="text-lg font-black tracking-tight italic uppercase leading-none">
                Club<span className="text-(--accent)">Hub</span>
              </h1>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full border border-(--border) bg-(--surface-strong) text-(--text-secondary) absolute -right-3 top-6 shadow-sm hover:text-(--accent)"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          <NavItem id="home" label="Home" icon={<Home size={20} />} href="/dashboard" activeId={activeTab} onNavigate={onNavigate} isCollapsed={isCollapsed} />
          <NavItem id="clubs" label="Clubs" icon={<Users size={20} />} href="/clubs" activeId={activeTab} onNavigate={onNavigate} isCollapsed={isCollapsed} />
          <NavItem id="calendar" label="Calendar" icon={<CalendarIcon size={20} />} href="/calendar" activeId={activeTab} onNavigate={onNavigate} isCollapsed={isCollapsed} />
          {canAccessAdmin(currentAccount) && (
            <NavItem id="admin" label="Admin" icon={<Shield size={20} />} href="/admin" activeId={activeTab} onNavigate={onNavigate} isCollapsed={isCollapsed} />
          )}
        </nav>

        <div className={`p-2 mt-auto border-t border-(--border) space-y-2 ${isCollapsed ? 'items-center' : ''}`}>
          <div className={`flex items-center rounded-xl overflow-hidden bg-(--surface-muted) ${isCollapsed ? 'flex-col p-1' : 'p-0.5'}`}>
            <button
              onClick={() => setIsDarkMode(false)}
              className={`flex items-center justify-center rounded-lg text-[9px] font-black uppercase transition-all
                ${isCollapsed ? 'w-8 h-8' : 'flex-1 py-1.5 gap-1.5'}
                ${!isDarkMode ? 'bg-(--surface-strong)ow-sm text-(--accent)' : 'text-(--text-secondary) hover:text-(--text-muted)'}`}
            >
              <Sun size={12} /> {!isCollapsed && 'Light'}
            </button>
            <button
              onClick={() => setIsDarkMode(true)}
              className={`flex items-center justify-center rounded-lg text-[9px] font-black uppercase transition-all
                ${isCollapsed ? 'w-8 h-8' : 'flex-1 py-1.5 gap-1.5'}
                ${isDarkMode ? 'bg-(--surface-strong) shadow-sm text-(--accent)' : 'text-(--text-secondary) hover:text-(--text-muted)'}`}
            >
              <Moon size={12} /> {!isCollapsed && 'Dark'}
            </button>
          </div>

          <div className="pt-1 space-y-1">
            {accounts.map((account) => {
              const selected = account.id === currentAccount.id;
              return (
                <button
                  key={account.id}
                  onClick={() => setCurrentAccountById(account.id)}
                  className={`w-full rounded-xl border px-2.5 py-2 text-[10px] font-black uppercase tracking-wide transition-colors ${
                    selected
                      ? "border-(--accent) bg-(--accent-soft) text-(--accent)"
                      : "border-(--border) text-(--text-secondary) hover:text-(--text-primary)"
                  } ${isCollapsed ? "text-[9px]" : ""}`}
                  title={account.name}
                >
                  {isCollapsed ? account.initials : account.name}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};

export default React.memo(SidebarComponent);
