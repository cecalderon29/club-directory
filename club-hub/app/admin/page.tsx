"use client";

import { useMemo, useState } from "react";
import { Mail, MapPin, Pencil, Save, Tag, Users, X } from "lucide-react";
import { Club, getClubs } from "../data/clubs";

type SocialPlatform = "instagram" | "twitter" | "facebook" | "remind";

type EditableClubFields = Pick<
  Club,
  "name" | "category" | "description" | "day" | "time" | "location" | "dues" | "socials" | "tags"
>;

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  twitter: "Twitter / X",
  facebook: "Facebook",
  remind: "Remind",
};

const DEFAULT_TAG_OPTIONS = [
  "STEM",
  "Arts",
  "Service",
  "Leadership",
  "Academic",
  "Competition",
  "Beginner Friendly",
  "Performance",
  "Community",
  "Volunteer",
  "Outdoors",
  "Social",
];

const SOCIAL_PLATFORMS: SocialPlatform[] = ["instagram", "twitter", "facebook", "remind"];

export default function AdminPage() {
  const [clubs, setClubs] = useState<Club[]>(() => getClubs());
  const [editingClubId, setEditingClubId] = useState<number | null>(null);
  const [clubDraft, setClubDraft] = useState<EditableClubFields | null>(null);
  const [customTagInput, setCustomTagInput] = useState("");

  const sponsors = useMemo(
    () =>
      Array.from(
        new Map(clubs.map((club) => [club.sponsor.email, { name: club.sponsor.name, email: club.sponsor.email }])).values()
      ),
    [clubs]
  );

  const [selectedSponsorEmail, setSelectedSponsorEmail] = useState(() => getClubs()[0]?.sponsor.email ?? "");

  const managedClubs = useMemo(
    () => clubs.filter((club) => club.sponsor.email === selectedSponsorEmail),
    [clubs, selectedSponsorEmail]
  );

  const availableTags = useMemo(() => {
    const existingTags = clubs.flatMap((club) => club.tags ?? []);
    return Array.from(new Set([...DEFAULT_TAG_OPTIONS, ...existingTags])).sort((a, b) => a.localeCompare(b));
  }, [clubs]);

  const selectedSponsorName = sponsors.find((sponsor) => sponsor.email === selectedSponsorEmail)?.name ?? "Sponsor";

  const startEdit = (club: Club) => {
    setEditingClubId(club.id);
    setCustomTagInput("");
    setClubDraft({
      name: club.name,
      category: club.category,
      description: club.description,
      day: club.day,
      time: club.time,
      location: club.location,
      dues: club.dues,
      tags: club.tags ?? [],
      socials: {
        instagram: club.socials.instagram ?? "",
        twitter: club.socials.twitter ?? "",
        facebook: club.socials.facebook ?? "",
        remind: club.socials.remind ?? "",
      },
    });
  };

  const cancelEdit = () => {
    setEditingClubId(null);
    setClubDraft(null);
    setCustomTagInput("");
  };

  const updateDraftField = <K extends keyof EditableClubFields>(field: K, value: EditableClubFields[K]) => {
    setClubDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateDraftSocial = (platform: SocialPlatform, value: string) => {
    setClubDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        socials: {
          ...prev.socials,
          [platform]: value,
        },
      };
    });
  };

  const toggleSocialPlatform = (platform: SocialPlatform) => {
    setClubDraft((prev) => {
      if (!prev) return prev;
      const currentlyEnabled = Boolean(prev.socials[platform]?.trim());
      return {
        ...prev,
        socials: {
          ...prev.socials,
          [platform]: currentlyEnabled ? "" : prev.socials[platform] ?? "@",
        },
      };
    });
  };

  const toggleTag = (tag: string) => {
    setClubDraft((prev) => {
      if (!prev) return prev;
      const prevTags = prev.tags ?? [];
      const nextTags = prevTags.includes(tag) ? prevTags.filter((item) => item !== tag) : [...prevTags, tag];
      return { ...prev, tags: nextTags };
    });
  };

  const addCustomTag = () => {
    const tag = customTagInput.trim();
    if (!tag) return;

    setClubDraft((prev) => {
      if (!prev) return prev;
      const prevTags = prev.tags ?? [];
      if (prevTags.includes(tag)) return prev;
      return { ...prev, tags: [...prevTags, tag] };
    });

    setCustomTagInput("");
  };

  const saveEdit = (clubId: number) => {
    if (!clubDraft) return;

    const normalizedTags = Array.from(new Set((clubDraft.tags ?? []).map((tag) => tag.trim()).filter(Boolean)));

    const normalizedSocials = SOCIAL_PLATFORMS.reduce<Club["socials"]>((acc, platform) => {
      const value = clubDraft.socials[platform]?.trim() ?? "";
      acc[platform] = value;
      return acc;
    }, {});

    setClubs((prev) =>
      prev.map((club) =>
        club.id === clubId
          ? {
              ...club,
              ...clubDraft,
              tags: normalizedTags,
              socials: normalizedSocials,
            }
          : club
      )
    );

    cancelEdit();
  };

  return (
    <div className="h-full overflow-y-auto bg-(--background)">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow-card)">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Sponsor Admin</h1>
              <p className="text-(--text-secondary) mt-2">Manage detailed club information for the selected sponsor.</p>
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
          <h2 className="text-lg font-black uppercase tracking-tight">{selectedSponsorName}&apos;s Clubs</h2>
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
                  className={`rounded-2xl border border-(--border) bg-(--surface) shadow-(--shadow-card) ${
                    isEditing ? "p-6 md:col-span-2 lg:col-span-3" : "p-5"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block mb-1 text-[10px] font-black uppercase tracking-wider text-(--text-muted)">
                              Category
                            </label>
                            <input
                              value={clubDraft.category}
                              onChange={(event) => updateDraftField("category", event.target.value)}
                              className="w-full rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-sm font-black uppercase tracking-wider text-(--accent) outline-none focus:ring-2 focus:ring-(--accent)"
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-[10px] font-black uppercase tracking-wider text-(--text-muted)">
                              Club Name
                            </label>
                            <input
                              value={clubDraft.name}
                              onChange={(event) => updateDraftField("name", event.target.value)}
                              className="w-full rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-base font-black leading-tight outline-none focus:ring-2 focus:ring-(--accent)"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-[10px] font-black uppercase tracking-wider text-(--accent) mb-1">{club.category}</div>
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
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                          Club Description
                        </label>
                        <textarea
                          value={clubDraft.description}
                          onChange={(event) => updateDraftField("description", event.target.value)}
                          className="w-full min-h-36 rounded-lg border border-(--border) bg-(--surface-strong) p-3 text-sm text-(--text-secondary) outline-none focus:ring-2 focus:ring-(--accent)"
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <section className="rounded-xl border border-(--border) bg-(--surface-strong) p-4 space-y-3">
                          <h4 className="text-sm font-black uppercase tracking-wider">Meeting Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                                Day
                              </label>
                              <input
                                value={clubDraft.day}
                                onChange={(event) => updateDraftField("day", event.target.value)}
                                className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 outline-none focus:ring-2 focus:ring-(--accent)"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                                Time
                              </label>
                              <input
                                value={clubDraft.time}
                                onChange={(event) => updateDraftField("time", event.target.value)}
                                className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 outline-none focus:ring-2 focus:ring-(--accent)"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                              Location
                            </label>
                            <input
                              value={clubDraft.location}
                              onChange={(event) => updateDraftField("location", event.target.value)}
                              className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 outline-none focus:ring-2 focus:ring-(--accent)"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                              Club Dues
                            </label>
                            <input
                              value={clubDraft.dues}
                              onChange={(event) => updateDraftField("dues", event.target.value)}
                              className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
                            />
                          </div>
                        </section>

                        <section className="rounded-xl border border-(--border) bg-(--surface-strong) p-4 space-y-3">
                          <h4 className="text-sm font-black uppercase tracking-wider">Tags</h4>
                          <p className="text-xs text-(--text-secondary)">Choose all tags that fit this club.</p>
                          <div className="flex flex-wrap gap-2">
                            {availableTags.map((tag) => {
                              const selected = (clubDraft.tags ?? []).includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => toggleTag(tag)}
                                  className={`px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider transition-colors ${
                                    selected
                                      ? "bg-(--accent-soft) text-(--accent) border-(--accent)"
                                      : "bg-(--surface) text-(--text-secondary) border-(--border) hover:text-(--text-primary)"
                                  }`}
                                >
                                  {tag}
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex gap-2">
                            <input
                              value={customTagInput}
                              onChange={(event) => setCustomTagInput(event.target.value)}
                              placeholder="Add custom tag"
                              className="flex-1 rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
                            />
                            <button
                              type="button"
                              onClick={addCustomTag}
                              className="rounded-lg border border-(--border) px-3 py-2 text-xs font-black uppercase hover:text-(--text-primary)"
                            >
                              Add
                            </button>
                          </div>
                        </section>
                      </div>

                      <section className="rounded-xl border border-(--border) bg-(--surface-strong) p-4 space-y-3">
                        <h4 className="text-sm font-black uppercase tracking-wider">Social Media</h4>
                        <p className="text-xs text-(--text-secondary)">Select the platforms this club uses and set each handle or link.</p>

                        <div className="flex flex-wrap gap-2">
                          {SOCIAL_PLATFORMS.map((platform) => {
                            const enabled = Boolean(clubDraft.socials[platform]?.trim());
                            return (
                              <button
                                key={platform}
                                type="button"
                                onClick={() => toggleSocialPlatform(platform)}
                                className={`px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider transition-colors ${
                                  enabled
                                    ? "bg-(--accent-soft) text-(--accent) border-(--accent)"
                                    : "bg-(--surface) text-(--text-secondary) border-(--border) hover:text-(--text-primary)"
                                }`}
                              >
                                {SOCIAL_LABELS[platform]}
                              </button>
                            );
                          })}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {SOCIAL_PLATFORMS.filter((platform) => Boolean(clubDraft.socials[platform]?.trim())).map((platform) => (
                            <div key={platform}>
                              <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                                {SOCIAL_LABELS[platform]}
                              </label>
                              <input
                                value={clubDraft.socials[platform] ?? ""}
                                onChange={(event) => updateDraftSocial(platform, event.target.value)}
                                placeholder={platform === "remind" ? "@clubcode" : "@handle or full URL"}
                                className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
                              />
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-(--text-secondary) line-clamp-4">{club.description}</p>

                      {(club.tags?.length ?? 0) > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {(club.tags ?? []).map((tag) => (
                            <span
                              key={`${club.id}-${tag}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-(--surface-strong) border border-(--border) text-[10px] font-black uppercase tracking-wider text-(--text-secondary)"
                            >
                              <Tag size={11} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

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
                    </>
                  )}
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
