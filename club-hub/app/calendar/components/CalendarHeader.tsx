import React from 'react';
import { Calendar as CalendarIcon, Star } from 'lucide-react';

interface CalendarHeaderProps {
  monthName: string;
  year: number;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export function CalendarHeader({ 
  monthName, 
  year, 
  showFavoritesOnly,
  onToggleFavorites 
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-3">
          <CalendarIcon size={32} className="text-[var(--accent)]" />
          Club Calendar
        </h1>
        <p className="text-[var(--text-secondary)] font-bold text-sm mt-1">Check out school events and activities</p>
      </div>

      <button 
        onClick={onToggleFavorites}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-md border-2 ${
          showFavoritesOnly 
            ? 'bg-[var(--accent)] text-[var(--text-inverse)] border-[var(--accent-strong)] hover:bg-[var(--accent-strong)]' 
            : 'bg-[var(--surface-strong)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--text-primary)]'
        }`}
      >
        <Star size={16} className={showFavoritesOnly ? 'fill-[var(--text-inverse)]' : ''} />
        {showFavoritesOnly ? 'Showing Favorites' : 'Show All Clubs'}
      </button>
    </div>
  );
}