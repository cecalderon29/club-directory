import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface TopBarProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSignedIn: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ setIsOpen, isSignedIn }) => (
  <header className={`h-16 flex items-center justify-between px-6 border-b transition-colors bg-(--surface) border-(--border) text-(--text-primary)] backdrop-blur-md sticky top-0 z-30`}>

    <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 hover:bg-(--hover-surface) rounded-lg">
      <Menu size={20} />
    </button>

    <div className="ml-auto flex items-center justify-end gap-3">
      {isSignedIn && (
        <button className="p-2 rounded-lg transition-colors relative hover:bg-(--hover-surface) text-(--text-secondary)">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-(--accent) rounded-full border border-(--background)"></span>
        </button>
      )}

      <div className="flex items-center gap-2.5 pl-3 border-l border-(--border)">
        <div className="text-right hidden sm:block">
          <div className="text-xs font-bold leading-none mb-0.5">
            {isSignedIn ? "Alex Chief" : "Student Account"}
          </div>
          <div className="text-[9px] uppercase font-black tracking-tighter text-(--text-secondary)">
            {isSignedIn ? "Sophomore" : "Guest Profile"}
          </div>
        </div>
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-(--accent) to-(--accent-strong) flex items-center justify-center font-bold text-[10px] text-(--text-inverse)">
          {isSignedIn ? "AC" : "SA"}
        </div>
      </div>
    </div>
  </header>
);

export default TopBar;