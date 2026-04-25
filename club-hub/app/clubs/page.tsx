import React, { useState } from 'react';
import { getClubs, getCategories, Club } from '../data/clubs';
import { ClubCard } from './components/ClubCard';
import { ClubModal } from './components/ClubModal';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';

// Get clubs data from JSON files (server-side)
const serverClubs = getClubs();
const CATEGORIES = getCategories(serverClubs);

const ClubsPage = ({ isDarkMode = false }) => {
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
    setSelectedClub(club);
    setCurrentImageIndex(0);
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
    <div className="h-full min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-rose-400 via-orange-400 to-amber-300">
      
      <div className="relative z-10 p-4 sm:p-8 flex flex-col h-full overflow-y-auto">
        {/* Header Section */}
        <div className="text-center mb-10 pt-6">
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-8 drop-shadow-md">
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
            <div className="col-span-full text-center py-16 text-white bg-black/10 rounded-3xl backdrop-blur-sm">
              <p className="font-bold text-xl">
                {selectedCategory === 'Favorites' ? "You haven't added any favorites yet!" : "No clubs found matching your search."}
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-6 px-8 py-3 bg-white text-orange-500 rounded-full text-base font-bold shadow-md hover:scale-105 transition-transform"
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
          isDarkMode={isDarkMode}
          currentImageIndex={currentImageIndex}
          favorites={favorites}
          onClose={() => setSelectedClub(null)}
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