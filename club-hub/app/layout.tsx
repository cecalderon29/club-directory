import type { Metadata } from "next";
import "./globals.css";
import ClientShell from "./components/ClientShell";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AccountProvider } from "./contexts/AccountContext";
import { StudentProvider } from "./contexts/StudentContext";

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
            <StudentProvider>
              <ClientShell>{children}</ClientShell>
            </StudentProvider>
          </AccountProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
