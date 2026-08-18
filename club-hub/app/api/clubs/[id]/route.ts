import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { canManageClub, getDemoAccountFromHeaders } from '@/lib/demo-auth';

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

// GET a specific club by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clubId } = await params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query<DbClub[]>(
      'SELECT * FROM clubs WHERE club_id = ?',
      [clubId]
    );
    connection.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clubId } = await params;
    const body = await request.json();
    const currentAccount = getDemoAccountFromHeaders(request.headers);

    const connection = await pool.getConnection();
    const [existingRows] = await connection.query<DbClub[]>(
      'SELECT contact_email FROM clubs WHERE club_id = ?',
      [clubId]
    );

    if (existingRows.length === 0) {
      connection.release();
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    const existingClub = existingRows[0];

    if (!canManageClub(currentAccount, existingClub.contact_email)) {
      connection.release();
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (
      currentAccount.role === 'teacher' &&
      currentAccount.sponsorEmail &&
      body.contact_email?.toLowerCase() !== existingClub.contact_email.toLowerCase()
    ) {
      connection.release();
      return NextResponse.json(
        { error: 'Only dean accounts can reassign club sponsorship' },
        { status: 403 }
      );
    }

    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE clubs SET name = ?, description = ?, category = ?, meeting_time = ?, location = ?, contact_email = ?, instagram_url = ?, twitter_url = ?, facebook_url = ?
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
        clubId,
      ]
    );
    connection.release();

    if (result.affectedRows === 0) {
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clubId } = await params;
    const currentAccount = getDemoAccountFromHeaders(request.headers);
    const connection = await pool.getConnection();
    const [existingRows] = await connection.query<DbClub[]>(
      'SELECT contact_email FROM clubs WHERE club_id = ?',
      [clubId]
    );

    if (existingRows.length === 0) {
      connection.release();
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    if (!canManageClub(currentAccount, existingRows[0].contact_email)) {
      connection.release();
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [result] = await connection.query<ResultSetHeader>(
      'DELETE FROM clubs WHERE club_id = ?',
      [clubId]
    );
    connection.release();

    if (result.affectedRows === 0) {
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