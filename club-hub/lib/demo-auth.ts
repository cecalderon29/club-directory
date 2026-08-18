export type DemoAccountRole = "student" | "teacher" | "dean";

export interface DemoAccount {
  id: string;
  name: string;
  role: DemoAccountRole;
  title: string;
  initials: string;
  sponsorEmail?: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "student-demo",
    name: "Student Demo",
    role: "student",
    title: "Guest Profile",
    initials: "SD",
  },
  {
    id: "teacher-demo",
    name: "Derek Miller",
    role: "teacher",
    title: "Sponsor Account",
    initials: "DM",
    sponsorEmail: "djmiller@naperville203.org",
  },
  {
    id: "dean-demo",
    name: "Dean Demo (Master)",
    role: "dean",
    title: "Master Admin",
    initials: "DD",
    sponsorEmail: "dean.demo@naperville203.org",
  },
];

export const DEMO_ACCOUNTS_BY_ID = new Map(DEMO_ACCOUNTS.map((account) => [account.id, account]));

export function getDemoAccountById(accountId: string | null | undefined): DemoAccount {
  if (!accountId) return DEMO_ACCOUNTS[0];
  return DEMO_ACCOUNTS_BY_ID.get(accountId) ?? DEMO_ACCOUNTS[0];
}

export function getDemoAccountFromHeaders(headers: Headers): DemoAccount {
  return getDemoAccountById(headers.get("x-demo-account-id"));
}

export function getTeacherAccountBySponsorEmail(email: string): DemoAccount | undefined {
  return DEMO_ACCOUNTS.find(
    (account) => account.role === "teacher" && account.sponsorEmail?.toLowerCase() === email.toLowerCase()
  );
}

export function canAccessAdmin(account: DemoAccount): boolean {
  return account.role === "teacher" || account.role === "dean";
}

export function canCreateClub(account: DemoAccount): boolean {
  return canAccessAdmin(account);
}

export function canManageClub(
  account: DemoAccount,
  sponsorEmail: string,
  authorizedUserIds: string[] = []
): boolean {
  if (account.role === "dean") return true;
  if (account.role === "teacher" && account.sponsorEmail?.toLowerCase() === sponsorEmail.toLowerCase()) return true;
  return authorizedUserIds.includes(account.id);
}
