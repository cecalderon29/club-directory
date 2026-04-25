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
      <div className="mb-4 text-white/90 text-sm font-bold uppercase tracking-widest">Filter by Category:</div>
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
                  ? 'bg-white text-orange-600 shadow-xl scale-105' 
                  : 'bg-black/20 text-white hover:bg-black/30 backdrop-blur-md shadow-sm'
              }`}
            >
              {isFavorites && (
                <Heart size={16} className={isActive ? 'fill-red-500 text-red-500' : 'fill-white text-white'} />
              )}
              {category}
            </button>
          );
        })}
      </div>
    </>
  );
}