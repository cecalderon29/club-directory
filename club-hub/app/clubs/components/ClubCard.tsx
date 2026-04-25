import React from 'react';
import { Heart } from 'lucide-react';
import { Club } from '../../data/clubs';

interface ClubCardProps {
  club: Club;
  isFavorite: boolean;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export function ClubCard({ club, isFavorite, onClick, onToggleFavorite }: ClubCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 p-8 rounded-3xl cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all group shadow-lg relative flex flex-col"
    >
      {/* Favorite Heart Button */}
      <button 
        onClick={onToggleFavorite}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-10"
      >
        <Heart 
          size={24} 
          className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-300 dark:text-zinc-600'}`} 
        />
      </button>

      <div className="mb-4">
        <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-black uppercase rounded-full tracking-wider shadow-sm">
          {club.category}
        </span>
      </div>
      
      <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-3 mt-2 leading-tight group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
        {club.name}
      </h3>
      
      <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 leading-relaxed">
        {club.description}
      </p>
    </div>
  );
}