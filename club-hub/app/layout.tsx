import type { Metadata } from "next";
import "./globals.css";
import ClientShell from "./components/ClientShell";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AccountProvider } from "./contexts/AccountContext";

export const metadata: Metadata = {
  title: "ClubHub",
  description: "Making Student Involvement Easy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AccountProvider>
            <ClientShell>{children}</ClientShell>
          </AccountProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
