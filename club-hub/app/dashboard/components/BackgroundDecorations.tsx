import React from 'react';
import { Calendar, Star, Trophy, Users } from 'lucide-react';

/**
 * Fun Background Elements - CSS-only for better performance
 */
const BackgroundDecorations = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 text-(--accent)">
    <Users className="absolute top-[7%] left-[-2%] rotate-12 opacity-20" size={78} strokeWidth={1.5} />
    <Calendar className="absolute bottom-[7%] left-[-3%] -rotate-12 opacity-20" size={82} strokeWidth={1.5} />
    <Star className="absolute top-[16%] right-[-2%] rotate-6 opacity-20" size={72} strokeWidth={1.5} />
    <Trophy className="absolute bottom-[14%] right-[-4%] -rotate-6 opacity-20" size={96} strokeWidth={1.5} />
    <div className="absolute top-[20%] left-[-8%] w-56 h-56 bg-(--accent) rounded-full blur-[110px] opacity-20 dark:opacity-30" />
    <div className="absolute bottom-[8%] right-[-10%] w-72 h-72 bg-(--accent-soft) rounded-full blur-[130px] opacity-35 dark:opacity-40" />
  </div>
);

export default BackgroundDecorations;
