"use client";

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

const MOCK_FAVORITES = [1, 3, 4];

const CalendarPage = ({ clubsData: propClubs }: { clubsData?: Club[] }) => {
  // Use prop clubs if provided, otherwise use server clubs
  const clubsData = propClubs && propClubs.length > 0 ? propClubs : serverClubs;
  
  // Navigation State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const today = new Date();

  // 1. Correctly derive year and month from state
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // 2. Extract and filter events based on the currently viewed month and favorites toggle
  const filteredEvents = useMemo((): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const monthShort = currentDate.toLocaleString('default', { month: 'short' });
    
    clubsData.forEach((club: Club) => {
      if (showFavoritesOnly && !MOCK_FAVORITES.includes(club.id)) return;

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
                isFavorite: MOCK_FAVORITES.includes(club.id)
              });
            }
          });
        }
      });
    return events;
  }, [clubsData, showFavoritesOnly, currentDate]);

  const exampleEvents = useMemo((): CalendarEvent[] => {
    const monthShort = currentDate.toLocaleString('default', { month: 'short' });
    const sample: CalendarEvent[] = [
      {
        name: 'Club Fair Preview',
        date: `${monthShort} 5`,
        clubId: 1,
        clubName: 'Computer Science Club',
        clubCategory: 'STEM',
        location: 'Main Commons',
        time: '3:30 PM - 4:30 PM',
        isFavorite: true
      },
      {
        name: 'Leadership Workshop',
        date: `${monthShort} 12`,
        clubId: 7,
        clubName: 'Key Club',
        clubCategory: 'Service',
        location: 'Room 210',
        time: '7:15 AM - 7:45 AM',
        isFavorite: true
      },
      {
        name: 'Open Rehearsal',
        date: `${monthShort} 19`,
        clubId: 3,
        clubName: 'Drama Club',
        clubCategory: 'Arts',
        location: 'Main Auditorium',
        time: '3:45 PM - 5:00 PM',
        isFavorite: true
      },
      {
        name: 'Weekend Skills Clinic',
        date: `${monthShort} 24`,
        clubId: 2,
        clubName: 'Robotics Team',
        clubCategory: 'STEM',
        location: 'Tech Lab A',
        time: '10:00 AM - 12:00 PM',
        isFavorite: false
      }
    ];

    return showFavoritesOnly ? sample.filter((event) => event.isFavorite) : sample;
  }, [currentDate, showFavoritesOnly]);

  const displayedEvents = filteredEvents.length > 0 ? filteredEvents : exampleEvents;

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
    return displayedEvents.filter(e => e.date === dateString);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto bg-[var(--background)] p-4 sm:p-6 font-sans text-[var(--text-primary)]">
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
          <div className="xl:col-span-3 bg-[var(--surface)] rounded-[2rem] shadow-xl border-2 border-[var(--border)] overflow-hidden">
            
            {/* Nav Header */}
            <div className="flex items-center justify-between p-6 bg-[var(--surface-soft)] border-b-2 border-[var(--border)]">
              <h2 className="text-3xl font-black text-[var(--text-primary)]">
                {monthName} <span className="text-[var(--text-secondary)]">{year}</span>
              </h2>
              
              <div className="flex items-center gap-2 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-xl p-1 shadow-sm">
                <button onClick={prevMonth} className="p-2 hover:bg-[var(--hover-surface)] rounded-lg text-[var(--text-primary)] transition-colors" aria-label="Previous Month">
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={resetToToday}
                  className="px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--hover-surface)] rounded-lg border border-transparent active:border-[var(--border)]"
                >
                  Today
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-[var(--hover-surface)] rounded-lg text-[var(--text-primary)] transition-colors" aria-label="Next Month">
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
            <div className="bg-[var(--surface)] rounded-[2rem] p-6 shadow-xl border-2 border-[var(--border)]">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-secondary)] mb-6 flex items-center gap-2">
                <Filter size={16} className="text-[var(--accent)]" /> Featured Events
              </h3>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                {displayedEvents.map((event, index) => (
                  <div key={index} className="bg-[var(--surface-soft)] rounded-2xl p-4 border-2 border-[var(--border)] hover:border-[var(--accent)] transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-[var(--accent)] text-[var(--text-inverse)] text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        {event.date}
                      </div>
                      {event.isFavorite && <Star size={14} className="fill-amber-400 text-amber-500" />}
                    </div>

                    <h4 className="font-black text-[var(--text-primary)] text-sm mb-1 leading-tight">
                      {event.name}
                    </h4>
                    
                    <p className="text-[11px] font-bold text-[var(--text-secondary)] mb-3 flex items-center gap-1">
                      <Users size={12} className="text-[var(--text-muted)]" /> {event.clubName}
                    </p>
                    
                    <div className="flex flex-col gap-1 text-[11px] font-black text-[var(--text-primary)] pt-3 border-t-2 border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[var(--accent)]" /> {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[var(--accent)]" /> {event.location}
                      </div>
                    </div>
                  </div>
                ))}
                
                {displayedEvents.length === 0 && (
                  <div className="text-center py-12 px-4 border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--surface-soft)]">
                    <p className="text-sm font-black text-[var(--text-secondary)] italic">No events scheduled for {monthName}.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tip Card */}
            <div className="bg-[var(--surface-strong)] rounded-[2rem] p-6 text-[var(--text-primary)] shadow-xl border-2 border-[var(--border)] relative overflow-hidden">
              <h4 className="text-xl font-black mb-2 relative z-10 text-[var(--accent)] uppercase italic tracking-tighter">School Spirit</h4>
              <p className="text-[var(--text-secondary)] text-xs leading-relaxed font-bold relative z-10">
                Favorited club events are highlighted in <span className="text-red-400 underline decoration-2">Red</span>. Don&apos;t forget to check the directory for new clubs!
              </p>
              <div className="absolute -right-8 -bottom-8 opacity-15 rotate-12 text-[var(--accent)]">
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
          background: var(--surface-soft);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border-strong);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;
