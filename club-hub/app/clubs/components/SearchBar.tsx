import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search clubs..." }: SearchBarProps) {
  return (
    <div className="max-w-3xl mx-auto relative mb-8">
      <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-zinc-400" size={24} />
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 pr-6 py-5 rounded-full text-base outline-none transition-all shadow-lg bg-white/95 text-black focus:ring-4 focus:ring-white/50 placeholder:text-zinc-400"
      />
    </div>
  );
}