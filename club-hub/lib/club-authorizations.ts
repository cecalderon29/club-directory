import {
  DEMO_ACCOUNTS,
  DEMO_ACCOUNTS_BY_ID,
  DemoAccount,
  canManageClub,
  getTeacherAccountBySponsorEmail,
} from "./demo-auth";

const clubAuthorizedUsers = new Map<number, Set<string>>();

function ensureClubSet(clubId: number, sponsorEmail: string): Set<string> {
  let userSet = clubAuthorizedUsers.get(clubId);

  if (!userSet) {
    userSet = new Set<string>();
    const sponsorAccount = getTeacherAccountBySponsorEmail(sponsorEmail);
    if (sponsorAccount) {
      userSet.add(sponsorAccount.id);
    }
    clubAuthorizedUsers.set(clubId, userSet);
  }

  return userSet;
}

export function getAuthorizedUserIdsForClub(clubId: number, sponsorEmail: string): string[] {
  return Array.from(ensureClubSet(clubId, sponsorEmail));
}

export function listAuthorizedUsersForClub(clubId: number, sponsorEmail: string): DemoAccount[] {
  const userIds = getAuthorizedUserIdsForClub(clubId, sponsorEmail);
  return userIds.map((id) => DEMO_ACCOUNTS_BY_ID.get(id)).filter((account): account is DemoAccount => Boolean(account));
}

export function addAuthorizedUserToClub(
  clubId: number,
  sponsorEmail: string,
  actor: DemoAccount,
  targetUserId: string
): { ok: true } | { ok: false; status: number; error: string } {
  const targetUser = DEMO_ACCOUNTS_BY_ID.get(targetUserId);
  if (!targetUser) return { ok: false, status: 404, error: "User not found" };
  if (targetUser.role === "student") return { ok: false, status: 400, error: "Students cannot be authorized club managers" };

  const set = ensureClubSet(clubId, sponsorEmail);
  if (!canManageClub(actor, sponsorEmail, Array.from(set))) return { ok: false, status: 403, error: "Forbidden" };
  if (set.has(targetUserId)) return { ok: false, status: 409, error: "User is already authorized for this club" };

  set.add(targetUserId);
  return { ok: true };
}

export function removeAuthorizedUserFromClub(
  clubId: number,
  sponsorEmail: string,
  actor: DemoAccount,
  targetUserId: string
): { ok: true } | { ok: false; status: number; error: string } {
  const set = ensureClubSet(clubId, sponsorEmail);
  if (!canManageClub(actor, sponsorEmail, Array.from(set))) return { ok: false, status: 403, error: "Forbidden" };

  const sponsorAccount = getTeacherAccountBySponsorEmail(sponsorEmail);
  if (sponsorAccount?.id === targetUserId) {
    return { ok: false, status: 400, error: "Cannot remove the sponsoring teacher from authorized users" };
  }

  if (!set.has(targetUserId)) return { ok: false, status: 404, error: "Authorized user not found for this club" };

  set.delete(targetUserId);
  return { ok: true };
}

export function listAssignableAuthorizedUsers(): DemoAccount[] {
  return DEMO_ACCOUNTS.filter((account) => account.role !== "student");
}
