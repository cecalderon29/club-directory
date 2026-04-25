import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  id: string;
  href: string;
  activeId: string;
  onNavigate: (href: string) => void;
  isCollapsed: boolean;
}

/**
 * NavItem Component
 */
const NavItem: React.FC<NavItemProps> = ({ icon, label, id, href, activeId, onNavigate, isCollapsed }) => {
  const active = id === activeId;
  return (
    <button
      onClick={() => onNavigate(href)}
      title={isCollapsed ? label : ''}
      className={`
        flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-bold transition-all duration-200 text-sm
        ${active
          ? 'bg-[var(--accent)] text-[var(--text-inverse)] shadow-md shadow-[var(--shadow-accent)]'
          : 'text-[var(--text-muted)] hover:bg-[var(--hover-surface)] hover:text-[var(--text-primary)]'}
        ${isCollapsed ? 'justify-center px-0' : ''}
      `}
    >
      <span className="shrink-0">{icon}</span>
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
};

export default NavItem;