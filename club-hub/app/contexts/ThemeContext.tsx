'use client';

import React, { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkModeState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = window.localStorage.getItem('clubhub-theme');
    if (savedTheme === 'dark') {
      setIsDarkModeState(true);
    } else if (savedTheme === 'light') {
      setIsDarkModeState(false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkModeState(prefersDark);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
    window.localStorage.setItem('clubhub-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, mounted]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode: setIsDarkModeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
