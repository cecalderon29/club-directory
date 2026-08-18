"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { DemoAccount, DEMO_ACCOUNTS } from "@/lib/demo-auth";
export type { DemoAccount } from "@/lib/demo-auth";

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
