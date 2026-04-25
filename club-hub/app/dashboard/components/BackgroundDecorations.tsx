import React from 'react';
import { Star, Trophy, BookOpen, GraduationCap } from 'lucide-react';

/**
 * Fun Background Elements - Scaled down for better fit
 */
const BackgroundDecorations = () => (
  <div className="fixed inset-0 pointer-events-none opacity-5 dark:opacity-[0.03] overflow-hidden z-0">
    <Star className="absolute top-[10%] left-[5%] rotate-12" size={80} />
    <Trophy className="absolute bottom-[15%] left-[10%] -rotate-12" size={100} />
    <BookOpen className="absolute top-[20%] right-[8%] rotate-45" size={70} />
    <GraduationCap className="absolute bottom-[20%] right-[15%] -rotate-6" size={120} />
    <div className="absolute top-[30%] left-[20%] w-48 h-48 bg-[var(--accent)] rounded-full blur-[100px]" />
    <div className="absolute bottom-[20%] right-[25%] w-60 h-60 bg-[var(--accent-soft)] rounded-full blur-[120px]" />
  </div>
);

export default BackgroundDecorations;