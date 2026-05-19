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
    <div className="grid grid-cols-7 gap-px bg-[var(--border)] border-2 border-[var(--border)]">
      {/* Day Headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="bg-[var(--surface-soft)] p-2 text-center text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">
          {day}
        </div>
      ))}

      {/* Blank cells for days before the 1st of month */}
      {blanks.map(i => (
        <div key={`blank-${i}`} className="bg-[var(--surface)] min-h-[120px] sm:min-h-[140px]" />
      ))}

      {/* Day cells */}
      {days.map(day => {
        const dayEvents = getEventsForDay(day);
        const isCurrentDay = isToday(day);
        
        return (
          <div 
            key={day} 
            className={`bg-[var(--surface-strong)] min-h-[120px] sm:min-h-[140px] p-2 transition-colors ${
              isCurrentDay
                ? 'bg-[var(--accent-soft)] ring-2 ring-[var(--accent)] ring-inset shadow-md'
                : 'hover:bg-[var(--hover-surface)]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div
                className={`text-sm font-black ${
                  isCurrentDay
                    ? 'text-[var(--text-inverse)] bg-[var(--accent)] rounded-full w-7 h-7 flex items-center justify-center'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {day}
              </div>
              {isCurrentDay && (
                <span className="text-[9px] font-black uppercase tracking-wider text-[var(--accent)]">
                  Today
                </span>
              )}
            </div>
            <div className="space-y-1">
              {dayEvents.slice(0, 3).map((evt, i) => (
                <div 
                  key={i}
                  className={`text-[10px] px-1.5 py-0.5 rounded truncate font-bold ${
                    evt.isFavorite 
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/25' 
                      : 'bg-[var(--surface-soft)] text-[var(--text-secondary)] border border-[var(--border)]'
                  }`}
                >
                  {evt.clubName}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-[10px] text-[var(--text-muted)] font-bold">
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
