import { Club } from './clubs';

export interface DbClub {
  club_id: number;
  name: string;
  description: string;
  category: string;
  meeting_time: string;
  location: string;
  contact_email: string;
  instagram_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  remind_url?: string;
}

/**
 * Fetch clubs from the database API
 */
export async function getClubsFromDatabase(): Promise<Club[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/clubs`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch clubs: ${response.status}`);
    }

    const dbClubs: DbClub[] = await response.json();

    // Transform database clubs to match Club interface
    return dbClubs.map(club => ({
      id: club.club_id,
      name: club.name,
      description: club.description,
      category: club.category,
      time: club.meeting_time,
      day: '', // You may want to add day field to database
      location: club.location,
      dues: '', // You may want to add dues field to database
      sponsor: {
        name: '',
        email: club.contact_email,
      },
      socials: {
        instagram: club.instagram_url,
        twitter: club.twitter_url,
        facebook: club.facebook_url,
        remind: club.remind_url,
      },
      events: [], // You may want to fetch events separately
      images: [], // You may want to fetch images separately
      tags: [club.category],
    }));
  } catch (error) {
    console.error('Error fetching clubs from database:', error);
    throw error;
  }
}

/**
 * Get a single club from the database by ID
 */
export async function getClubFromDatabase(clubId: number): Promise<Club | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/clubs/${clubId}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch club: ${response.status}`);
    }

    const dbClub: DbClub = await response.json();

    return {
      id: dbClub.club_id,
      name: dbClub.name,
      description: dbClub.description,
      category: dbClub.category,
      time: dbClub.meeting_time,
      day: '',
      location: dbClub.location,
      dues: '',
      sponsor: {
        name: '',
        email: dbClub.contact_email,
      },
      socials: {
        instagram: dbClub.instagram_url,
        twitter: dbClub.twitter_url,
        facebook: dbClub.facebook_url,
        remind: dbClub.remind_url,
      },
      events: [],
      images: [],
      tags: [dbClub.category],
    };
  } catch (error) {
    console.error(`Error fetching club ${clubId} from database:`, error);
    throw error;
  }
}
