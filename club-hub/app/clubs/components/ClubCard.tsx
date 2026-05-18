import React from 'react';
import { Heart } from 'lucide-react';
import { Club } from '../../data/clubs';

interface ClubCardProps {
  club: Club;
  isFavorite: boolean;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const ClubCardComponent = ({ club, isFavorite, onClick, onToggleFavorite }: ClubCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-[var(--surface)] p-8 rounded-3xl cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all group shadow-lg relative flex flex-col border border-[var(--border)]"
    >
      {/* Favorite Heart Button */}
      <button 
        onClick={onToggleFavorite}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--hover-surface)] transition-colors z-10"
      >
        <Heart 
          size={24} 
          className={`transition-colors ${isFavorite ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} 
        />
      </button>

      <div className="mb-4">
        <span className="px-4 py-2 bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-black uppercase rounded-full tracking-wider shadow-sm">
          {club.category}
        </span>
      </div>
      
      <h3 className="text-3xl font-black text-[var(--text-primary)] mb-3 mt-2 leading-tight group-hover:text-[var(--accent)] transition-colors">
        {club.name}
      </h3>
      
      <p className="text-[var(--text-secondary)] text-sm line-clamp-3 leading-relaxed">
        {club.description}
      </p>
    </div>
  );
};

export const ClubCard = React.memo(ClubCardComponent);