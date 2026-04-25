import React from 'react';
import { Heart } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <>
      <div className="mb-4 text-[var(--text-secondary)] text-sm font-bold uppercase tracking-widest">Filter by Category:</div>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
        {categories.map(category => {
          const isFavorites = category === 'Favorites';
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-6 py-3 rounded-full text-base font-bold transition-all flex items-center gap-2 ${
                isActive 
                  ? 'bg-[var(--accent)] text-[var(--text-inverse)] shadow-xl scale-105' 
                  : 'bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--hover-surface)] backdrop-blur-md shadow-sm border border-[var(--border)]'
              }`}
            >
              {isFavorites && (
                <Heart size={16} className={isActive ? 'fill-[var(--text-inverse)] text-[var(--text-inverse)]' : 'fill-[var(--accent)] text-[var(--accent)]'} />
              )}
              {category}
            </button>
          );
        })}
      </div>
    </>
  );
}