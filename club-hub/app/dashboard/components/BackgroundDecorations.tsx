import React from 'react';

/**
 * Fun Background Elements - CSS-only for better performance
 */
const BackgroundDecorations = () => (
  <div className="fixed inset-0 pointer-events-none opacity-5 dark:opacity-[0.03] overflow-hidden z-0">
    {/* CSS shapes instead of SVG icons */}
    <div className="absolute top-[10%] left-[5%] w-20 h-20 rounded-lg bg-current rotate-12" />
    <div className="absolute bottom-[15%] left-[10%] w-24 h-24 rounded-full bg-current -rotate-12" />
    <div className="absolute top-[20%] right-[8%] w-16 h-16 bg-current rotate-45" />
    <div className="absolute bottom-[20%] right-[15%] w-28 h-28 rounded-full bg-current -rotate-6" />
    <div className="absolute top-[30%] left-[20%] w-48 h-48 bg-(--accent) rounded-full blur-[100px]" />
    <div className="absolute bottom-[20%] right-[25%] w-60 h-60 bg-(--accent-soft) rounded-full blur-[120px]" />
  </div>
);

export default BackgroundDecorations;