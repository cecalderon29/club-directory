import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface StudentFavorite extends RowDataPacket {
  student_id: number;
  club_id: number;
  favorited_at: Date;
}

// GET all favorites for a student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');

    if (!studentId) {
      return NextResponse.json(
        { error: 'student_id is required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query<StudentFavorite[]>(
      'SELECT * FROM student_favorites WHERE student_id = ? ORDER BY favorited_at DESC',
      [studentId]
    );
    connection.release();

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// ADD a favorite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_id, club_id } = body;

    if (!student_id || !club_id) {
      return NextResponse.json(
        { error: 'student_id and club_id are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    
    // Check if favorite already exists
    const [existing] = await connection.query<StudentFavorite[]>(
      'SELECT * FROM student_favorites WHERE student_id = ? AND club_id = ?',
      [student_id, club_id]
    );

    if (existing.length > 0) {
      connection.release();
      return NextResponse.json(
        { error: 'Club is already favorited' },
        { status: 409 }
      );
    }

    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO student_favorites (student_id, club_id, favorited_at) VALUES (?, ?, NOW())',
      [student_id, club_id]
    );
    connection.release();

    return NextResponse.json(
      { student_id, club_id, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// DELETE a favorite
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_id, club_id } = body;

    if (!student_id || !club_id) {
      return NextResponse.json(
        { error: 'student_id and club_id are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      'DELETE FROM student_favorites WHERE student_id = ? AND club_id = ?',
      [student_id, club_id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}