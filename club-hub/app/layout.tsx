import type { Metadata } from "next";
import "./globals.css";
import ClientShell from "./components/ClientShell";

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
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
