"use client";

import Link from 'next/link';
import { Users, Calendar as CalendarIcon, Trophy, Star } from 'lucide-react';
import BackgroundDecorations from './components/BackgroundDecorations';

export default function App() {
  return (
    <div className="relative h-full overflow-y-auto">
      <BackgroundDecorations />
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Hero Section - Scaled Down */}
          <div className="p-8 md:p-10 rounded-4xl relative overflow-hidden border bg-(--surface) border-(--border) shadow-(--shadow-card) backdrop-blur-md">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="max-w-lg text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-3">
                  Making Student <br />
                  Involvement <br />
                  <span className="text-(--accent) underline decoration-4 underline-offset-4">Easy.</span>
                </h2>
                <p className="text-sm md:text-base font-medium text-(--text-muted)">
                  Discover clubs, sync your schedule, and lead your community.
                </p>
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                  <Link
                    href="/clubs"
                    className="bg-(--accent) text-(--text-inverse) px-6 py-3 rounded-xl font-black italic uppercase tracking-wider text-xs hover:scale-105 transition-all shadow-(--shadow-accent)"
                  >
                    Browse Clubs
                  </Link>
                  <Link
                    href="/calendar"
                    className="px-6 py-3 rounded-xl font-black italic uppercase tracking-wider text-xs border-2 border-(--border) transition-all hover:bg-(--hover-surface) hover:text-(--accent)"
                  >
                    Calendar
                  </Link>
                </div>
              </div>

              <div className="shrink-0 grid grid-cols-2 gap-2 rotate-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center ${
                      i % 2 === 0
                        ? 'bg-(--accent) text-(--text-inverse) rotate-6'
                        : 'bg-(--surface-strong) -rotate-6'
                    } shadow-lg border-2 border-transparent`}
                  >
                    {i === 1 && <Trophy size={32} />}
                    {i === 2 && <span className="text-xl font-black">ACT</span>}
                    {i === 3 && <span className="text-xl font-black">FUN</span>}
                    {i === 4 && <Star size={32} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Sections - More compact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl border bg-(--surface) border-(--border) shadow-(--shadow-card) backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black italic uppercase tracking-tight">Happening Today</h3>
                <span className="px-2 py-0.5 bg-(--accent-soft) text-(--accent) text-[9px] font-black uppercase rounded-full">
                  3 Events
                </span>
              </div>
              <div className="space-y-3">
                {[
                  {
                    title: 'Chess Club Blitz',
                    time: '3:30 PM',
                    loc: 'Room 204',
                    color: 'bg-[var(--surface-soft)] text-[var(--text-primary)]',
                    accent: false,
                  },
                  {
                    title: 'Drama Rehearsal',
                    time: '4:00 PM',
                    loc: 'The Stage',
                    color: 'bg-[var(--accent)] text-[var(--text-inverse)] shadow-md shadow-[var(--shadow-accent)]',
                    accent: true,
                  },
                  {
                    title: 'Varsity Esports',
                    time: '4:15 PM',
                    loc: 'Lab A',
                    color: 'bg-[var(--surface-soft)] text-[var(--text-primary)]',
                    accent: false,
                  },
                ].map((evt, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer ${evt.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          evt.accent
                            ? 'bg-(--surface-soft)'
                            : 'bg-(--accent-soft) text-(--accent)'
                        }`}
                      >
                        <CalendarIcon size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-xs leading-none mb-1">{evt.title}</div>
                        <div
                          className={`text-[9px] font-black uppercase tracking-widest ${
                            evt.accent ? 'text-(--text-inverse)/90' : 'text-(--text-muted)'
                          }`}
                        >
                          {evt.loc}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-[10px] font-black italic ${
                        evt.accent ? 'text-(--text-inverse)' : 'text-(--accent)'
                      }`}
                    >
                      {evt.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl border bg-(--surface) border-(--border) shadow-(--shadow-card) backdrop-blur-md">
              <h3 className="text-lg font-black italic uppercase tracking-tight mb-6">Hall of Fame</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Hiking', tag: 'Outdoors', members: '24' },
                  { name: 'K-Pop', tag: 'Culture', members: '56' },
                  { name: 'Robotics', tag: 'Science', members: '18' },
                  { name: 'Cooking', tag: 'Life', members: '32' },
                ].map((club, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-(--border) bg-(--surface-strong) transition-all hover:scale-[1.02] cursor-pointer shadow-sm"
                  >
                    <div className="text-[9px] font-black uppercase tracking-tighter mb-1 text-(--accent)">
                      {club.tag}
                    </div>
                    <div className="font-black italic text-sm uppercase leading-none mb-2">{club.name}</div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-(--text-muted)">
                      <Users size={10} /> {club.members}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
