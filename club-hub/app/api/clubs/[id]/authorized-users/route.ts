import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";
import pool from "@/lib/db";
import { getDemoAccountFromHeaders } from "@/lib/demo-auth";
import {
  addAuthorizedUserToClub,
  listAssignableAuthorizedUsers,
  listAuthorizedUsersForClub,
  removeAuthorizedUserFromClub,
} from "@/lib/club-authorizations";

interface ClubOwner extends RowDataPacket {
  club_id: number;
  contact_email: string;
}

async function getClubOwner(clubId: string): Promise<ClubOwner | null> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<ClubOwner[]>(
      "SELECT club_id, contact_email FROM clubs WHERE club_id = ?",
      [clubId]
    );

    return rows[0] ?? null;
  } finally {
    connection.release();
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const club = await getClubOwner(id);
    if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

    const users = listAuthorizedUsersForClub(club.club_id, club.contact_email);
    const assignableUsers = listAssignableAuthorizedUsers();

    return NextResponse.json({ authorizedUsers: users, assignableUsers }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch authorized users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentAccount = getDemoAccountFromHeaders(request.headers);
    const body = await request.json();
    const targetUserId = typeof body.userId === "string" ? body.userId : "";

    if (!targetUserId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const { id } = await params;
    const club = await getClubOwner(id);
    if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

    const result = addAuthorizedUserToClub(club.club_id, club.contact_email, currentAccount, targetUserId);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const users = listAuthorizedUsersForClub(club.club_id, club.contact_email);
    return NextResponse.json({ authorizedUsers: users }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to add authorized user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentAccount = getDemoAccountFromHeaders(request.headers);
    const body = await request.json();
    const targetUserId = typeof body.userId === "string" ? body.userId : "";

    if (!targetUserId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const { id } = await params;
    const club = await getClubOwner(id);
    if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

    const result = removeAuthorizedUserFromClub(club.club_id, club.contact_email, currentAccount, targetUserId);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const users = listAuthorizedUsersForClub(club.club_id, club.contact_email);
    return NextResponse.json({ authorizedUsers: users }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to remove authorized user" }, { status: 500 });
  }
}
