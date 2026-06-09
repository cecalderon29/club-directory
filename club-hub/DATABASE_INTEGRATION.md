# Database Integration Guide

## Overview
This document describes how the Club Directory application integrates with a MySQL database to manage clubs and student favorites.

## Database Schema

### Tables

#### `clubs`
Stores all club information.
- `club_id` (INT, UN, AI, PK) - Unique identifier
- `name` (VARCHAR(45)) - Club name
- `description` (VARCHAR(255)) - Club description
- `category` (VARCHAR(45)) - Club category
- `meeting_time` (VARCHAR(45)) - Meeting time
- `location` (VARCHAR(45)) - Location
- `contact_email` (VARCHAR(45)) - Contact email
- `instagram_url` (VARCHAR(255)) - Instagram URL
- `twitter_url` (VARCHAR(255)) - Twitter URL
- `facebook_url` (VARCHAR(255)) - Facebook URL
- `remind_url` (VARCHAR(255)) - Remind URL

#### `student_favorites`
Tracks which clubs students have favorited.
- `student_id` (INT, UN, PK) - Student ID
- `club_id` (INT, UN, PK) - Club ID
- `favorited_at` (DATETIME) - Timestamp when favorited

#### `students`
Stores student information.
- `student_id` (INT, UN, AI, PK) - Unique identifier
- `name` (VARCHAR(45)) - Student name
- `email` (VARCHAR(45)) - Student email

## API Endpoints

### Clubs
- `GET /api/clubs` - Fetch all clubs
- `GET /api/clubs/[id]` - Fetch a specific club
- `POST /api/clubs` - Create a new club (admin)
- `PUT /api/clubs/[id]` - Update a club
- `DELETE /api/clubs/[id]` - Delete a club

### Student Favorites
- `GET /api/favorites?student_id=[id]` - Get all favorites for a student
- `POST /api/favorites` - Add a club to favorites
- `DELETE /api/favorites` - Remove a club from favorites

## Setup Instructions

### 1. Environment Configuration
Create a `.env.local` file in the `club-hub` directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=club_directory
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Database Connection
The application uses the `mysql2/promise` package for database connectivity.

**File:** `club-hub/app/lib/db.ts`
```typescript
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export default db;
```

### 3. Using Database Data in Components

The clubs page now fetches data from the database:

```typescript
// club-hub/app/clubs/page.tsx
import { getClubsFromDatabase } from '../data/db-clubs';

const loadClubs = async () => {
  try {
    const dbClubs = await getClubsFromDatabase();
    setClubsData(dbClubs);
  } catch (err) {
    // Falls back to JSON data if database is unavailable
    setClubsData(getClubs());
  }
};
```

## Features

### Database Integration
- ✅ Fetch clubs from MySQL database
- ✅ Create new clubs
- ✅ Update club information
- ✅ Delete clubs
- ✅ Manage student favorites
- ✅ Track favorited timestamps

### Fallback Support
If the database connection fails, the application automatically falls back to loading clubs from JSON files, ensuring the application remains functional.

### Error Handling
- Database connection errors are logged and handled gracefully
- HTTP error responses with appropriate status codes
- User-friendly error messages in the UI

## Notes

- The database connection uses a connection pool for better performance
- All queries are parameterized to prevent SQL injection
- The application transforms database records to match the internal `Club` interface
- Future enhancements can include club events and images in the database

