import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Star,
  Filter
} from 'lucide-react';
import { getClubs, Club } from '../data/clubs';
import { CalendarGrid } from './components/CalendarGrid';
import { CalendarHeader } from './components/CalendarHeader';

// Get clubs data from JSON files (server-side)
const serverClubs = getClubs();

interface CalendarEvent {
  name: string;
  date: string;
  clubId: number;
  clubName: string;
  clubCategory: string;
  location: string;
  time: string;
  isFavorite: boolean;
}

const CalendarPage = ({ clubsData: propClubs }: { clubsData?: Club[] }) => {
  // Use prop clubs if provided, otherwise use server clubs
  const clubsData = propClubs && propClubs.length > 0 ? propClubs : serverClubs;
  
  // Navigation State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const today = new Date();

  // Mock Favorites IDs (Replace with your state logic)
  const mockFavorites = [1, 3, 4]; 

  // 1. Correctly derive year and month from state
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // 2. Extract and filter events based on the currently viewed month and favorites toggle
  const filteredEvents = useMemo((): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const monthShort = currentDate.toLocaleString('default', { month: 'short' });
    
    clubsData.forEach((club: Club) => {
      if (showFavoritesOnly && !mockFavorites.includes(club.id)) return;

      if (club.events) {
        club.events.forEach((event: { name: string; date: string }) => {
          // Only pull events for the current month being viewed
          if (event.date.startsWith(monthShort)) {
            events.push({
              ...event,
              clubId: club.id,
              clubName: club.name,
              clubCategory: club.category,
              location: club.location,
              time: club.time,
              isFavorite: mockFavorites.includes(club.id)
            });
          }
        });
      }
    });
    return events;
  }, [clubsData, showFavoritesOnly, currentDate]);

  // 3. Navigation Handlers that update state correctly
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  // 4. Calendar Math for Grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  // Helper to find events for a specific day cell
  const getEventsForDay = (day: number) => {
    const monthShort = currentDate.toLocaleString('default', { month: 'short' });
    const dateString = `${monthShort} ${day}`;
    return filteredEvents.filter(e => e.date === dateString);
  };

  return (
    <div className="h-full min-h-screen flex flex-col bg-zinc-200 p-4 sm:p-6 font-sans text-black">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Calendar Header Component */}
        <CalendarHeader
          monthName={monthName}
          year={year}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Calendar Main Grid */}
          <div className="xl:col-span-3 bg-white rounded-[2rem] shadow-xl border-2 border-zinc-300 overflow-hidden">
            
            {/* Nav Header */}
            <div className="flex items-center justify-between p-6 bg-zinc-50 border-b-2 border-zinc-200">
              <h2 className="text-3xl font-black text-black">
                {monthName} <span className="text-zinc-400">{year}</span>
              </h2>
              
              <div className="flex items-center gap-2 bg-white border-2 border-zinc-300 rounded-xl p-1 shadow-sm">
                <button onClick={prevMonth} className="p-2 hover:bg-zinc-100 rounded-lg text-black transition-colors" aria-label="Previous Month">
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={resetToToday}
                  className="px-4 py-1.5 text-xs font-black uppercase tracking-widest text-black hover:bg-zinc-100 rounded-lg border border-transparent active:border-zinc-300"
                >
                  Today
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-zinc-100 rounded-lg text-black transition-colors" aria-label="Next Month">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Calendar Grid Component */}
              <CalendarGrid
                days={days}
                blanks={blanks}
                getEventsForDay={getEventsForDay}
                today={today}
                year={year}
                month={month}
              />
            </div>
          </div>

          {/* Side Panel: Event Feed */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-xl border-2 border-zinc-300">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                <Filter size={16} className="text-red-600" /> Featured Events
              </h3>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                {filteredEvents.map((event, index) => (
                  <div key={index} className="bg-zinc-50 rounded-2xl p-4 border-2 border-zinc-200 hover:border-red-500 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        {event.date}
                      </div>
                      {event.isFavorite && <Star size={14} className="fill-amber-400 text-amber-500" />}
                    </div>

                    <h4 className="font-black text-black text-sm mb-1 leading-tight">
                      {event.name}
                    </h4>
                    
                    <p className="text-[11px] font-bold text-zinc-600 mb-3 flex items-center gap-1">
                      <Users size={12} className="text-zinc-400" /> {event.clubName}
                    </p>
                    
                    <div className="flex flex-col gap-1 text-[11px] font-black text-zinc-800 pt-3 border-t-2 border-zinc-200">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-red-600" /> {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-red-600" /> {event.location}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredEvents.length === 0 && (
                  <div className="text-center py-12 px-4 border-2 border-dashed border-zinc-300 rounded-3xl bg-zinc-50">
                    <p className="text-sm font-black text-zinc-500 italic">No events scheduled for {monthName}.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tip Card */}
            <div className="bg-zinc-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
              <h4 className="text-xl font-black mb-2 relative z-10 text-red-500 uppercase italic tracking-tighter">School Spirit</h4>
              <p className="text-zinc-300 text-xs leading-relaxed font-bold relative z-10">
                Favorited club events are highlighted in <span className="text-amber-400 underline decoration-2">Gold</span>. Don't forget to check the directory for new clubs!
              </p>
              <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                <CalendarIcon size={120} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f4f4f5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4d4d8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1aa;
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;