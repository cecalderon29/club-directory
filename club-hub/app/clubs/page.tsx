"use client";

import React, { useState } from 'react';
import { getClubs, getCategories, Club } from '../data/clubs';
import { ClubCard } from './components/ClubCard';
import { ClubModal } from './components/ClubModal';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';

// Get clubs data from JSON files (server-side)
const serverClubs = getClubs();
const CATEGORIES = getCategories(serverClubs);

const ClubsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Use clubs from JSON files
  const CLUBS_DATA = serverClubs;

  // Filter logic
  const filteredClubs = CLUBS_DATA.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          club.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' 
      ? true 
      : selectedCategory === 'Favorites' 
        ? favorites.includes(club.id)
        : club.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (club: Club) => {
    window.dispatchEvent(new CustomEvent('clubhub:modal-opened'));
    setSelectedClub(club);
    setCurrentImageIndex(0);
  };

  const handleCloseModal = () => {
    window.dispatchEvent(new CustomEvent('clubhub:modal-closed'));
    setSelectedClub(null);
  };

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    if (e) e.stopPropagation(); 
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedClub) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedClub.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedClub) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedClub.images.length) % selectedClub.images.length);
  };

  return (
    <div className="h-full min-h-full flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgb(239,68,68),transparent_30%),linear-gradient(160deg,rgb(255,200,200),rgb(255,180,180))]">
      <div className="relative z-10 p-4 sm:p-8 flex flex-col h-full overflow-y-auto">
        {/* Header Section */}
        <div className="text-center mb-10 pt-6">
          <h1 className="text-5xl md:text-6xl font-black text-(--text-primary) tracking-tight mb-8 drop-shadow-md">
            Explore Clubs
          </h1>
          
          {/* Search Bar Component */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Category Filters Component */}
          <CategoryFilter 
            categories={CATEGORIES} 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Club Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full pb-10">
          {filteredClubs.length > 0 ? (
            filteredClubs.map(club => (
              <ClubCard
                key={club.id}
                club={club}
                isFavorite={favorites.includes(club.id)}
                onClick={() => handleOpenModal(club)}
                onToggleFavorite={(e) => toggleFavorite(e, club.id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-(--text-primary) bg-(--surface) border border-(--border) rounded-3xl backdrop-blur-sm">
              <p className="font-bold text-xl text-(--text-secondary)">
                {selectedCategory === 'Favorites' ? "You haven't added any favorites yet!" : "No clubs found matching your search."}
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-6 px-8 py-3 bg-(--accent) text-(--text-inverse) rounded-full text-base font-bold shadow-md hover:scale-105 transition-transform"
              >
                View All Clubs
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Club Modal */}
      {selectedClub && (
        <ClubModal
          club={selectedClub}
          currentImageIndex={currentImageIndex}
          favorites={favorites}
          onClose={handleCloseModal}
          onToggleFavorite={(e) => toggleFavorite(e, selectedClub.id)}
          onNextImage={nextImage}
          onPrevImage={prevImage}
          onImageIndexChange={setCurrentImageIndex}
        />
      )}
    </div>
  );
};

export default ClubsPage;
