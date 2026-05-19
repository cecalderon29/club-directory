"use client";

import { useMemo, useState } from "react";
import { Mail, MapPin, Users } from "lucide-react";
import { getClubs } from "../data/clubs";

const clubs = getClubs();

const sponsors = Array.from(
  new Map(
    clubs.map((club) => [club.sponsor.email, { name: club.sponsor.name, email: club.sponsor.email }])
  ).values()
);

export default function AdminPage() {
  const [selectedSponsorEmail, setSelectedSponsorEmail] = useState(sponsors[0]?.email ?? "");

  const managedClubs = useMemo(
    () => clubs.filter((club) => club.sponsor.email === selectedSponsorEmail),
    [selectedSponsorEmail]
  );

  const selectedSponsorName =
    sponsors.find((sponsor) => sponsor.email === selectedSponsorEmail)?.name ?? "Sponsor";

  return (
    <div className="h-full overflow-y-auto bg-(--background)">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow-card)">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Sponsor Admin</h1>
              <p className="text-(--text-secondary) mt-2">
                View only the clubs managed by the selected sponsor.
              </p>
            </div>

            <div className="w-full md:w-80">
              <label htmlFor="sponsor" className="block text-xs font-black uppercase tracking-wider mb-2 text-(--text-muted)">
                Sponsor
              </label>
              <select
                id="sponsor"
                value={selectedSponsorEmail}
                onChange={(event) => setSelectedSponsorEmail(event.target.value)}
                className="w-full rounded-xl border border-(--border) bg-(--surface-strong) p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-(--accent)"
              >
                {sponsors.map((sponsor) => (
                  <option key={sponsor.email} value={sponsor.email}>
                    {sponsor.name} ({sponsor.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-tight">
            {selectedSponsorName}&apos;s Clubs
          </h2>
          <span className="px-3 py-1 rounded-full bg-(--accent-soft) text-(--accent) text-xs font-black uppercase">
            {managedClubs.length} Club{managedClubs.length === 1 ? "" : "s"}
          </span>
        </div>

        {managedClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
            {managedClubs.map((club) => (
              <article
                key={club.id}
                className="rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow-card)"
              >
                <div className="mb-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-(--accent) mb-1">
                    {club.category}
                  </div>
                  <h3 className="text-xl font-black leading-tight">{club.name}</h3>
                </div>

                <p className="text-sm text-(--text-secondary) line-clamp-4">{club.description}</p>

                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-(--text-secondary)">
                    <MapPin size={15} className="text-(--accent)" />
                    <span>{club.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-(--text-secondary)">
                    <Mail size={15} className="text-(--accent)" />
                    <span>{club.sponsor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-(--text-secondary)">
                    <Users size={15} className="text-(--accent)" />
                    <span>
                      {club.day} · {club.time}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-(--border) bg-(--surface) p-8 text-center text-(--text-secondary)">
            No clubs are assigned to this sponsor.
          </div>
        )}
      </div>
    </div>
  );
}
