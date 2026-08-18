import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { canCreateClub, getDemoAccountFromHeaders } from '@/lib/demo-auth';

export interface DbClub extends RowDataPacket {
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
}

// GET all clubs
export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<DbClub[]>(
      'SELECT * FROM clubs ORDER BY club_id ASC'
    );
    connection.release();

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clubs' },
      { status: 500 }
    );
  }
}

// POST a new club (admin only)
export async function POST(request: NextRequest) {
  try {
    const currentAccount = getDemoAccountFromHeaders(request.headers);
    if (!canCreateClub(currentAccount)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      meeting_time,
      location,
      contact_email,
      instagram_url,
      twitter_url,
      facebook_url,
    } = body;

    if (
      currentAccount.role === 'teacher' &&
      currentAccount.sponsorEmail &&
      contact_email?.toLowerCase() !== currentAccount.sponsorEmail.toLowerCase()
    ) {
      return NextResponse.json(
        { error: 'Teachers can only create clubs assigned to their own sponsor email' },
        { status: 403 }
      );
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO clubs (name, description, category, meeting_time, location, contact_email, instagram_url, twitter_url, facebook_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, category, meeting_time, location, contact_email, instagram_url, twitter_url, facebook_url]
    );
    connection.release();

    return NextResponse.json(
      { club_id: result.insertId, ...body },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create club' },
      { status: 500 }
    );
  }
}