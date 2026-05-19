import React from 'react';
import { Calendar, Star, Trophy, Users } from 'lucide-react';

/**
 * Fun Background Elements - CSS-only for better performance
 */
const BackgroundDecorations = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 text-(--accent)">
    <Users className="absolute top-[10%] left-[6%] rotate-12 opacity-20" size={72} strokeWidth={1.5} />
    <Calendar className="absolute bottom-[12%] left-[10%] -rotate-12 opacity-20" size={78} strokeWidth={1.5} />
    <Star className="absolute top-[22%] right-[8%] rotate-6 opacity-20" size={64} strokeWidth={1.5} />
    <Trophy className="absolute bottom-[20%] right-[14%] -rotate-6 opacity-20" size={86} strokeWidth={1.5} />
    <div className="absolute top-[28%] left-[18%] w-48 h-48 bg-(--accent) rounded-full blur-[100px] opacity-20 dark:opacity-30" />
    <div className="absolute bottom-[18%] right-[22%] w-60 h-60 bg-(--accent-soft) rounded-full blur-[120px] opacity-35 dark:opacity-40" />
  </div>
);

export default BackgroundDecorations;
