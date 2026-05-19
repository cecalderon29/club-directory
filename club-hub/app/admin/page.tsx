"use client";

import { useMemo, useState } from "react";
import { Mail } from "lucide-react";
import { getClubs, type Club } from "../data/clubs";

type EditableClubField = "name" | "category" | "description" | "location" | "day" | "time" | "dues";
const initialClubs = getClubs();

export default function AdminPage() {
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [selectedSponsorEmail, setSelectedSponsorEmail] = useState(initialClubs[0]?.sponsor.email ?? "");

  const sponsors = useMemo(
    () =>
      Array.from(
        new Map(
          clubs.map((club) => [club.sponsor.email, { name: club.sponsor.name, email: club.sponsor.email }])
        ).values()
      ),
    [clubs]
  );

  const managedClubs = useMemo(
    () => clubs.filter((club) => club.sponsor.email === selectedSponsorEmail),
    [clubs, selectedSponsorEmail]
  );

  const selectedSponsorName =
    sponsors.find((sponsor) => sponsor.email === selectedSponsorEmail)?.name ?? "Sponsor";

  const updateClubField = <K extends EditableClubField>(clubId: number, field: K, value: Club[K]) => {
    setClubs((previousClubs) =>
      previousClubs.map((club) => (club.id === clubId ? { ...club, [field]: value } : club))
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-(--background)">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow-card)">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Sponsor Admin</h1>
              <p className="text-(--text-secondary) mt-2">
                Edit the clubs managed by the selected sponsor.
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
                  <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                    Club Name
                  </label>
                  <input
                    type="text"
                    value={club.name}
                    onChange={(event) => updateClubField(club.id, "name", event.target.value)}
                    className="w-full rounded-xl border border-(--border) bg-(--surface-strong) p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-(--accent)"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={club.category}
                      onChange={(event) => updateClubField(club.id, "category", event.target.value)}
                      className="w-full rounded-xl border border-(--border) bg-(--surface-strong) p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-(--accent)"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                      Description
                    </label>
                    <textarea
                      value={club.description}
                      onChange={(event) => updateClubField(club.id, "description", event.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-(--border) bg-(--surface-strong) p-2.5 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={club.location}
                      onChange={(event) => updateClubField(club.id, "location", event.target.value)}
                      className="w-full rounded-xl border border-(--border) bg-(--surface-strong) p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-(--accent)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                        Day
                      </label>
                      <input
                        type="text"
                        value={club.day}
                        onChange={(event) => updateClubField(club.id, "day", event.target.value)}
                        className="w-full rounded-xl border border-(--border) bg-(--surface-strong) p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-(--accent)"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                        Time
                      </label>
                      <input
                        type="text"
                        value={club.time}
                        onChange={(event) => updateClubField(club.id, "time", event.target.value)}
                        className="w-full rounded-xl border border-(--border) bg-(--surface-strong) p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-(--accent)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                      Dues
                    </label>
                    <input
                      type="text"
                      value={club.dues}
                      onChange={(event) => updateClubField(club.id, "dues", event.target.value)}
                      className="w-full rounded-xl border border-(--border) bg-(--surface-strong) p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-(--accent)"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
                    <Mail size={15} className="text-(--accent)" />
                    <span>{club.sponsor.email}</span>
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
