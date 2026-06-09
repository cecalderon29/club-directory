import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

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
  remind_url?: string;
}

// GET a specific club by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clubId = params.id;
    const [rows] = await db.query<DbClub[]>(
      'SELECT * FROM clubs WHERE club_id = ?',
      [clubId]
    );

    if ((rows as DbClub[]).length === 0) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      );
    }

    return NextResponse.json((rows as DbClub[])[0], { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch club' },
      { status: 500 }
    );
  }
}

// UPDATE a club
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clubId = params.id;
    const body = await request.json();

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE clubs SET name = ?, description = ?, category = ?, meeting_time = ?, location = ?, contact_email = ?, instagram_url = ?, twitter_url = ?, facebook_url = ?, remind_url = ?
       WHERE club_id = ?`,
      [
        body.name,
        body.description,
        body.category,
        body.meeting_time,
        body.location,
        body.contact_email,
        body.instagram_url,
        body.twitter_url,
        body.facebook_url,
        body.remind_url,
        clubId,
      ]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { club_id: clubId, ...body },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update club' },
      { status: 500 }
    );
  }
}

// DELETE a club
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clubId = params.id;
    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM clubs WHERE club_id = ?',
      [clubId]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete club' },
      { status: 500 }
    );
  }
}
