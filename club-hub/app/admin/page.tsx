"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, MapPin, Pencil, Save, Users, X } from "lucide-react";
import { Club, getClubs } from "../data/clubs";

type EditableClubFields = Pick<Club, "name" | "category" | "description" | "day" | "time" | "location" | "dues">;

export default function AdminPage() {
  const [clubs, setClubs] = useState<Club[]>(() => getClubs());
  const [editingClubId, setEditingClubId] = useState<number | null>(null);
  const [clubDraft, setClubDraft] = useState<EditableClubFields | null>(null);

  const sponsors = useMemo(
    () =>
      Array.from(
        new Map(
          clubs.map((club) => [club.sponsor.email, { name: club.sponsor.name, email: club.sponsor.email }])
        ).values()
      ),
    [clubs]
  );

  const [selectedSponsorEmail, setSelectedSponsorEmail] = useState("");

  useEffect(() => {
    if (!sponsors.length) {
      setSelectedSponsorEmail("");
      return;
    }
    if (!selectedSponsorEmail || !sponsors.some((sponsor) => sponsor.email === selectedSponsorEmail)) {
      setSelectedSponsorEmail(sponsors[0].email);
    }
  }, [selectedSponsorEmail, sponsors]);

  const managedClubs = useMemo(
    () => clubs.filter((club) => club.sponsor.email === selectedSponsorEmail),
    [clubs, selectedSponsorEmail]
  );

  const selectedSponsorName =
    sponsors.find((sponsor) => sponsor.email === selectedSponsorEmail)?.name ?? "Sponsor";

  const startEdit = (club: Club) => {
    setEditingClubId(club.id);
    setClubDraft({
      name: club.name,
      category: club.category,
      description: club.description,
      day: club.day,
      time: club.time,
      location: club.location,
      dues: club.dues,
    });
  };

  const cancelEdit = () => {
    setEditingClubId(null);
    setClubDraft(null);
  };

  const updateDraftField = <K extends keyof EditableClubFields>(field: K, value: EditableClubFields[K]) => {
    setClubDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const saveEdit = (clubId: number) => {
    if (!clubDraft) return;
    setClubs((prev) => prev.map((club) => (club.id === clubId ? { ...club, ...clubDraft } : club)));
    cancelEdit();
  };

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
            {managedClubs.map((club) => {
              const isEditing = editingClubId === club.id && clubDraft !== null;
              return (
                <article
                  key={club.id}
                  className="rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow-card)"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <>
                          <input
                            value={clubDraft.category}
                            onChange={(event) => updateDraftField("category", event.target.value)}
                            className="mb-2 w-full rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-[10px] font-black uppercase tracking-wider text-(--accent) outline-none focus:ring-2 focus:ring-(--accent)"
                          />
                          <input
                            value={clubDraft.name}
                            onChange={(event) => updateDraftField("name", event.target.value)}
                            className="w-full rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-xl font-black leading-tight outline-none focus:ring-2 focus:ring-(--accent)"
                          />
                        </>
                      ) : (
                        <>
                          <div className="text-[10px] font-black uppercase tracking-wider text-(--accent) mb-1">
                            {club.category}
                          </div>
                          <h3 className="text-xl font-black leading-tight">{club.name}</h3>
                        </>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => saveEdit(club.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-(--accent) px-3 py-2 text-xs font-black uppercase text-(--text-inverse) hover:bg-(--accent-strong)"
                        >
                          <Save size={14} />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-1 rounded-lg border border-(--border) px-3 py-2 text-xs font-black uppercase text-(--text-secondary) hover:text-(--text-primary)"
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(club)}
                        className="inline-flex items-center gap-1 rounded-lg border border-(--border) px-3 py-2 text-xs font-black uppercase text-(--text-secondary) hover:text-(--text-primary) shrink-0"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <textarea
                      value={clubDraft.description}
                      onChange={(event) => updateDraftField("description", event.target.value)}
                      className="w-full min-h-24 rounded-lg border border-(--border) bg-(--surface-strong) p-3 text-sm text-(--text-secondary) outline-none focus:ring-2 focus:ring-(--accent)"
                    />
                  ) : (
                    <p className="text-sm text-(--text-secondary) line-clamp-4">{club.description}</p>
                  )}

                  <div className="mt-5 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-(--text-secondary)">
                      <MapPin size={15} className="text-(--accent)" />
                      {isEditing ? (
                        <input
                          value={clubDraft.location}
                          onChange={(event) => updateDraftField("location", event.target.value)}
                          className="w-full rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 outline-none focus:ring-2 focus:ring-(--accent)"
                        />
                      ) : (
                        <span>{club.location}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-(--text-secondary)">
                      <Mail size={15} className="text-(--accent)" />
                      <span>{club.sponsor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-(--text-secondary)">
                      <Users size={15} className="text-(--accent)" />
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <input
                            value={club.day}
                            onChange={(event) => updateDraftField("day", event.target.value)}
                            className="w-full rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 outline-none focus:ring-2 focus:ring-(--accent)"
                          />
                          <input
                            value={clubDraft.time}
                            onChange={(event) => updateDraftField("time", event.target.value)}
                            className="w-full rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 outline-none focus:ring-2 focus:ring-(--accent)"
                          />
                        </div>
                      ) : (
                        <span>
                          {club.day} · {club.time}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <div className="pt-1">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                          Club Dues
                        </label>
                        <input
                          value={clubDraft.dues}
                          onChange={(event) => updateDraftField("dues", event.target.value)}
                          className="w-full rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
                        />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
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
