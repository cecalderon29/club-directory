import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface TopBarProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSignedIn: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ setIsOpen, isSignedIn }) => (
  <header className={`h-16 flex items-center justify-between px-6 border-b transition-colors bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] backdrop-blur-md sticky top-0 z-30`}>

    <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 hover:bg-[var(--hover-surface)] rounded-lg">
      <Menu size={20} />
    </button>

    <div className="flex items-center gap-3">
      {isSignedIn && (
        <>
          <button className="p-2 rounded-lg transition-colors relative hover:bg-[var(--hover-surface)] text-[var(--text-secondary)]">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[var(--accent)] rounded-full border border-[var(--background)]"></span>
          </button>
          <div className="flex items-center gap-2.5 pl-3 border-l border-[var(--border)]">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold leading-none mb-0.5">Alex Chief</div>
              <div className="text-[9px] uppercase font-black text-[var(--accent)] tracking-tighter">Sophomore</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] flex items-center justify-center font-bold text-[10px] text-[var(--text-inverse)]">
              AC
            </div>
          </div>
        </>
      )}
    </div>
  </header>
);

export default TopBar;