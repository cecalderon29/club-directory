import React from 'react';
import { CalendarEvent } from '../../data/clubs';

interface CalendarGridProps {
  days: number[];
  blanks: number[];
  getEventsForDay: (day: number) => CalendarEvent[];
  today: Date;
  year: number;
  month: number;
}

export function CalendarGrid({ days, blanks, getEventsForDay, today, year, month }: CalendarGridProps) {
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-zinc-300 border-2 border-zinc-300">
      {/* Day Headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="bg-zinc-100 p-2 text-center text-xs font-black uppercase tracking-widest text-zinc-600">
          {day}
        </div>
      ))}

      {/* Blank cells for days before the 1st of month */}
      {blanks.map(i => (
        <div key={`blank-${i}`} className="bg-zinc-50 min-h-[120px] sm:min-h-[140px]" />
      ))}

      {/* Day cells */}
      {days.map(day => {
        const dayEvents = getEventsForDay(day);
        const isCurrentDay = isToday(day);
        
        return (
          <div 
            key={day} 
            className={`bg-white min-h-[120px] sm:min-h-[140px] p-2 transition-colors ${
              isCurrentDay ? 'bg-orange-50' : 'hover:bg-zinc-50'
            }`}
          >
            <div className={`text-sm font-black mb-1 ${isCurrentDay ? 'text-red-600' : 'text-zinc-700'}`}>
              {day}
            </div>
            <div className="space-y-1">
              {dayEvents.slice(0, 3).map((evt, i) => (
                <div 
                  key={i}
                  className={`text-[10px] px-1.5 py-0.5 rounded truncate font-bold ${
                    evt.isFavorite 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                  }`}
                >
                  {evt.clubName}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-[10px] text-zinc-500 font-bold">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}