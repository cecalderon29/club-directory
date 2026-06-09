"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type DemoAccountRole = "student" | "teacher";

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
];

interface AccountContextValue {
  accounts: DemoAccount[];
  currentAccount: DemoAccount;
  setCurrentAccountById: (id: string) => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [currentAccountId, setCurrentAccountId] = useState<string>(DEMO_ACCOUNTS[0].id);

  const value = useMemo(() => {
    const currentAccount =
      DEMO_ACCOUNTS.find((account) => account.id === currentAccountId) ?? DEMO_ACCOUNTS[0];

    return {
      accounts: DEMO_ACCOUNTS,
      currentAccount,
      setCurrentAccountById: setCurrentAccountId,
    };
  }, [currentAccountId]);

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }

  return context;
}
