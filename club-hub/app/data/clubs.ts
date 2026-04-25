import fs from 'fs';
import path from 'path';

export interface Club {
  id: number;
  name: string;
  category: string;
  description: string;
  time: string;
  day: string;
  location: string;
  dues: string;
  sponsor: { name: string; email: string };
  socials: { instagram?: string; twitter?: string; remind?: string };
  events: { name: string; date: string }[];
  images: string[];
}

const dataDir = path.join(process.cwd(), 'app', 'data');

export function getClubs(): Club[] {
  const clubs: Club[] = [];
  
  // Read all JSON files in the data directory
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    // Skip the images directory if it has a .json extension
    if (file === 'images') continue;
    
    const filePath = path.join(dataDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const clubData = JSON.parse(fileContent);
    
    clubs.push(clubData);
  }
  
  // Sort by ID
  clubs.sort((a, b) => a.id - b.id);
  
  return clubs;
}

export function getCategories(clubs: Club[]): string[] {
  const categories = new Set<string>();
  
  for (const club of clubs) {
    if (club.category) {
      categories.add(club.category);
    }
  }
  
  // Return sorted categories with 'All' and 'Favorites' at the beginning
  return ['All', 'Favorites', ...Array.from(categories).sort()];
}