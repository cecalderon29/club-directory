import computerScience from './computer-science.json';
import drama from './drama.json';
import hikingOutdoors from './hiking-outdoors.json';
import keyClub from './key-club.json';
import kpopDance from './kpop-dance.json';
import mathTeam from './math-team.json';
import robotics from './robotics.json';

export interface Club {
  id: number;
  name: string;
  category: string;
  tags?: string[];
  description: string;
  time: string;
  day: string;
  location: string;
  dues: string;
  sponsor: { name: string; email: string };
  socials: { instagram?: string; twitter?: string; facebook?: string; remind?: string };
  events: { name: string; date: string }[];
  images: string[];
}

export interface CalendarEvent {
  name: string;
  date: string;
  clubId: number;
  clubName: string;
  clubCategory: string;
  location: string;
  time: string;
  isFavorite: boolean;
}

const allClubs: Club[] = [
  computerScience,
  drama,
  hikingOutdoors,
  keyClub,
  kpopDance,
  mathTeam,
  robotics,
].sort((a, b) => a.id - b.id);

export function getClubs(): Club[] {
  return allClubs;
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
