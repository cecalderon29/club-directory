"use client";

import { useMemo, useState, useEffect } from "react";
import { Mail, MapPin, Pencil, Plus, Save, Tag, Trash2, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Club, getClubs } from "../data/clubs";
import { useAccount } from "../contexts/AccountContext";
import {
  DEMO_ACCOUNTS,
  DemoAccount,
  canAccessAdmin,
  canCreateClub,
  canManageClub,
  getTeacherAccountBySponsorEmail,
} from "@/lib/demo-auth";

type SocialPlatform = "instagram" | "twitter" | "facebook";

type EditableClubFields = {
  name: string;
  description: string;
  day: string;
  time: string;
  location: string;
  dues: string;
  tags: string[];
  socials: Club["socials"];
  sponsorEmail: string;
};

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  twitter: "Twitter / X",
  facebook: "Facebook",
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

const SOCIAL_PLATFORMS: SocialPlatform[] = ["instagram", "twitter", "facebook"];

const MANAGEABLE_ACCOUNT_OPTIONS = DEMO_ACCOUNTS.filter((account) => account.role !== "student");

function normalizeTagList(tags: string[]): string[] {
  return Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)));
}

function getSponsorName(email: string): string {
  return getTeacherAccountBySponsorEmail(email)?.name ?? "Faculty Sponsor";
}

export default function AdminPage() {
  const router = useRouter();
  const { currentAccount } = useAccount();
  const [clubs, setClubs] = useState<Club[]>(() =>
    getClubs().map((club) => {
      const sponsorAccount = getTeacherAccountBySponsorEmail(club.sponsor.email);
      return {
        ...club,
        authorizedUserIds: sponsorAccount ? [sponsorAccount.id] : club.authorizedUserIds ?? [],
      };
    })
  );

  const [editingClubId, setEditingClubId] = useState<number | null>(null);
  const [clubDraft, setClubDraft] = useState<EditableClubFields | null>(null);
  const [createDraft, setCreateDraft] = useState<EditableClubFields>({
    name: "",
    description: "",
    day: "",
    time: "",
    location: "",
    dues: "",
    tags: [],
    socials: {
      instagram: "",
      twitter: "",
      facebook: "",
    },
    sponsorEmail: currentAccount.sponsorEmail ?? "",
  });
  const [pendingAuthorizedSelections, setPendingAuthorizedSelections] = useState<Record<number, string>>({});

  const manageableClubs = useMemo(() => {
    if (!canAccessAdmin(currentAccount)) {
      return [];
    }

    return clubs.filter((club) => canManageClub(currentAccount, club.sponsor.email, club.authorizedUserIds ?? []));
  }, [clubs, currentAccount]);

  useEffect(() => {
    if (!canAccessAdmin(currentAccount)) {
      router.replace("/dashboard");
    }
  }, [currentAccount, router]);

  const availableTags = useMemo(() => {
    const existingTags = clubs.flatMap((club) => club.tags ?? []);
    return Array.from(new Set([...DEFAULT_TAG_OPTIONS, ...existingTags])).sort((a, b) => a.localeCompare(b));
  }, [clubs]);

  const startEdit = (club: Club) => {
    setEditingClubId(club.id);
    setClubDraft({
      name: club.name,
      description: club.description,
      day: club.day,
      time: club.time,
      location: club.location,
      dues: club.dues,
      tags: club.tags ?? [],
      sponsorEmail: club.sponsor.email,
      socials: {
        instagram: club.socials.instagram ?? "",
        twitter: club.socials.twitter ?? "",
        facebook: club.socials.facebook ?? "",
      },
    });
  };

  const cancelEdit = () => {
    setEditingClubId(null);
    setClubDraft(null);
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
          [platform]: currentlyEnabled ? "" : prev.socials[platform]?.trim() || "@",
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

  const saveEdit = (clubId: number) => {
    if (!clubDraft) return;

    setClubs((prev) =>
      prev.map((club) => {
        if (club.id !== clubId) return club;
        if (!canManageClub(currentAccount, club.sponsor.email, club.authorizedUserIds ?? [])) {
          return club;
        }

        const normalizedTags = normalizeTagList(clubDraft.tags ?? []);

        const normalizedSocials = SOCIAL_PLATFORMS.reduce<Club["socials"]>((acc, platform) => {
          const value = clubDraft.socials[platform]?.trim() ?? "";
          acc[platform] = value;
          return acc;
        }, {});

        const nextSponsorEmail = currentAccount.role === "dean" ? clubDraft.sponsorEmail : club.sponsor.email;
        const nextAuthorizedUsers = new Set(club.authorizedUserIds ?? []);
        const sponsorAccount = getTeacherAccountBySponsorEmail(nextSponsorEmail);
        if (sponsorAccount) {
          nextAuthorizedUsers.add(sponsorAccount.id);
        }

        return {
          ...club,
          name: clubDraft.name,
          description: clubDraft.description,
          day: clubDraft.day,
          time: clubDraft.time,
          location: clubDraft.location,
          dues: clubDraft.dues,
          tags: normalizedTags,
          socials: normalizedSocials,
          sponsor: {
            name: getSponsorName(nextSponsorEmail),
            email: nextSponsorEmail,
          },
          authorizedUserIds: Array.from(nextAuthorizedUsers),
        };
      })
    );

    cancelEdit();
  };

  const updateCreateField = <K extends keyof EditableClubFields>(field: K, value: EditableClubFields[K]) => {
    setCreateDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateCreateSocial = (platform: SocialPlatform, value: string) => {
    setCreateDraft((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platform]: value,
      },
    }));
  };

  const toggleCreateSocialPlatform = (platform: SocialPlatform) => {
    setCreateDraft((prev) => {
      const currentlyEnabled = Boolean(prev.socials[platform]?.trim());
      return {
        ...prev,
        socials: {
          ...prev.socials,
          [platform]: currentlyEnabled ? "" : prev.socials[platform]?.trim() || "@",
        },
      };
    });
  };

  const toggleCreateTag = (tag: string) => {
    setCreateDraft((prev) => {
      const nextTags = prev.tags.includes(tag) ? prev.tags.filter((item) => item !== tag) : [...prev.tags, tag];
      return { ...prev, tags: nextTags };
    });
  };

  const createClub = () => {
    if (!canCreateClub(currentAccount)) {
      return;
    }

    const sponsorEmail =
      currentAccount.role === "teacher" ? currentAccount.sponsorEmail ?? "" : createDraft.sponsorEmail.trim();
    if (!createDraft.name.trim() || !sponsorEmail) {
      return;
    }

    const normalizedSocials = SOCIAL_PLATFORMS.reduce<Club["socials"]>((acc, platform) => {
      acc[platform] = createDraft.socials[platform]?.trim() ?? "";
      return acc;
    }, {});

    const sponsorAccount = getTeacherAccountBySponsorEmail(sponsorEmail);
    const nextId = Math.max(...clubs.map((club) => club.id), 0) + 1;

    setClubs((prev) => [
      ...prev,
      {
        id: nextId,
        name: createDraft.name.trim(),
        category: normalizeTagList(createDraft.tags)[0] ?? "General",
        tags: normalizeTagList(createDraft.tags),
        description: createDraft.description.trim(),
        day: createDraft.day.trim(),
        time: createDraft.time.trim(),
        location: createDraft.location.trim(),
        dues: createDraft.dues.trim(),
        sponsor: {
          name: getSponsorName(sponsorEmail),
          email: sponsorEmail,
        },
        authorizedUserIds: sponsorAccount ? [sponsorAccount.id] : [],
        socials: normalizedSocials,
        events: [],
        images: [],
      },
    ]);

    setCreateDraft({
      name: "",
      description: "",
      day: "",
      time: "",
      location: "",
      dues: "",
      tags: [],
      socials: {
        instagram: "",
        twitter: "",
        facebook: "",
      },
      sponsorEmail: currentAccount.role === "teacher" ? currentAccount.sponsorEmail ?? "" : "",
    });
  };

  const getAuthorizedUsersForClub = (club: Club): DemoAccount[] => {
    const ids = club.authorizedUserIds ?? [];
    return ids
      .map((id) => DEMO_ACCOUNTS.find((account) => account.id === id))
      .filter((account): account is DemoAccount => Boolean(account));
  };

  const addAuthorizedUser = (club: Club) => {
    const targetUserId = pendingAuthorizedSelections[club.id];
    if (!targetUserId) return;
    if (!canManageClub(currentAccount, club.sponsor.email, club.authorizedUserIds ?? [])) return;

    setClubs((prev) =>
      prev.map((item) => {
        if (item.id !== club.id) return item;

        const ids = new Set(item.authorizedUserIds ?? []);
        if (ids.has(targetUserId)) return item;

        const target = DEMO_ACCOUNTS.find((account) => account.id === targetUserId);
        if (!target || target.role === "student") return item;

        ids.add(targetUserId);
        return { ...item, authorizedUserIds: Array.from(ids) };
      })
    );

    setPendingAuthorizedSelections((prev) => ({ ...prev, [club.id]: "" }));
  };

  const removeAuthorizedUser = (club: Club, userId: string) => {
    if (!canManageClub(currentAccount, club.sponsor.email, club.authorizedUserIds ?? [])) return;

    const sponsorAccount = getTeacherAccountBySponsorEmail(club.sponsor.email);
    if (sponsorAccount?.id === userId) {
      return;
    }

    setClubs((prev) =>
      prev.map((item) =>
        item.id === club.id
          ? {
              ...item,
              authorizedUserIds: (item.authorizedUserIds ?? []).filter((id) => id !== userId),
            }
          : item
      )
    );
  };

  if (!canAccessAdmin(currentAccount)) {
    return null;
  }

  return (
    <div className="h-full overflow-y-auto bg-(--background)">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow-card)">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
               <h1 className="text-3xl md:text-4xl font-black tracking-tight">Club Admin</h1>
               <p className="text-(--text-secondary) mt-2">Create clubs, edit details, and manage authorized club users.</p>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow-card) space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black uppercase tracking-tight">Create Club</h2>
            <button
              onClick={createClub}
              className="inline-flex items-center gap-1 rounded-lg bg-(--accent) px-3 py-2 text-xs font-black uppercase text-(--text-inverse) hover:bg-(--accent-strong)"
            >
              <Plus size={14} />
              Create
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={createDraft.name}
              onChange={(event) => updateCreateField("name", event.target.value)}
              placeholder="Club Name"
              className="rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
            />
            {currentAccount.role === "dean" ? (
              <select
                value={createDraft.sponsorEmail}
                onChange={(event) => updateCreateField("sponsorEmail", event.target.value)}
                className="rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
              >
                <option value="">Assign Sponsor</option>
                {MANAGEABLE_ACCOUNT_OPTIONS.filter((account) => account.role === "teacher" && account.sponsorEmail).map((account) => (
                  <option key={account.id} value={account.sponsorEmail}>
                    {account.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={currentAccount.sponsorEmail ?? ""}
                readOnly
                className="rounded-lg border border-(--border) bg-(--surface-soft) px-3 py-2 text-sm text-(--text-secondary)"
              />
            )}
            <input
              value={createDraft.day}
              onChange={(event) => updateCreateField("day", event.target.value)}
              placeholder="Meeting Day"
              className="rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
            />
            <input
              value={createDraft.time}
              onChange={(event) => updateCreateField("time", event.target.value)}
              placeholder="Meeting Time"
              className="rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
            />
            <input
              value={createDraft.location}
              onChange={(event) => updateCreateField("location", event.target.value)}
              placeholder="Location"
              className="rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
            />
            <input
              value={createDraft.dues}
              onChange={(event) => updateCreateField("dues", event.target.value)}
              placeholder="Club Dues"
              className="rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
            />
          </div>

          <textarea
            value={createDraft.description}
            onChange={(event) => updateCreateField("description", event.target.value)}
            placeholder="Club Description"
            className="w-full min-h-24 rounded-lg border border-(--border) bg-(--surface-strong) p-3 text-sm text-(--text-secondary) outline-none focus:ring-2 focus:ring-(--accent)"
          />

          <div className="space-y-3">
            <p className="text-xs text-(--text-secondary)">Select tags and social media for this club.</p>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const selected = createDraft.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleCreateTag(tag)}
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

            <div className="flex flex-wrap gap-2">
              {SOCIAL_PLATFORMS.map((platform) => {
                const enabled = Boolean(createDraft.socials[platform]?.trim());
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => toggleCreateSocialPlatform(platform)}
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
              {SOCIAL_PLATFORMS.filter((platform) => Boolean(createDraft.socials[platform]?.trim())).map((platform) => (
                <input
                  key={platform}
                  value={createDraft.socials[platform] ?? ""}
                  onChange={(event) => updateCreateSocial(platform, event.target.value)}
                  placeholder="@handle or full URL"
                  className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
                />
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-tight">Manage Clubs</h2>
          <span className="px-3 py-1 rounded-full bg-(--accent-soft) text-(--accent) text-xs font-black uppercase">
            {manageableClubs.length} Club{manageableClubs.length === 1 ? "" : "s"}
          </span>
        </div>

        {manageableClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
            {manageableClubs.map((club) => {
              const isEditing = editingClubId === club.id && clubDraft !== null;
              const authorizedUsers = getAuthorizedUsersForClub(club);
              const selectableUsers = MANAGEABLE_ACCOUNT_OPTIONS.filter(
                (account) => !(club.authorizedUserIds ?? []).includes(account.id)
              );

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
                      ) : (
                        <>
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

                          {currentAccount.role === "dean" && (
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-wider text-(--text-muted) mb-1">
                                Sponsor
                              </label>
                              <select
                                value={clubDraft.sponsorEmail}
                                onChange={(event) => updateDraftField("sponsorEmail", event.target.value)}
                                className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
                              >
                                {MANAGEABLE_ACCOUNT_OPTIONS.filter((account) => account.role === "teacher" && account.sponsorEmail).map((account) => (
                                  <option key={account.id} value={account.sponsorEmail}>
                                    {account.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
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
                                placeholder="@handle or full URL"
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

                  <section className="mt-5 rounded-xl border border-(--border) bg-(--surface-strong) p-4 space-y-3">
                    <h4 className="text-sm font-black uppercase tracking-wider">Authorized Users</h4>
                    <div className="space-y-2">
                      {authorizedUsers.length > 0 ? (
                        authorizedUsers.map((user) => (
                          <div key={`${club.id}-${user.id}`} className="flex items-center justify-between rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-xs">
                            <span className="font-bold">
                              {user.name} · {user.title}
                            </span>
                            {canManageClub(currentAccount, club.sponsor.email, club.authorizedUserIds ?? []) && (
                              <button
                                type="button"
                                onClick={() => removeAuthorizedUser(club, user.id)}
                                className="inline-flex items-center gap-1 text-(--text-secondary) hover:text-(--accent)"
                              >
                                <Trash2 size={13} /> Remove
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-(--text-secondary)">No authorized users yet.</p>
                      )}
                    </div>

                    {canManageClub(currentAccount, club.sponsor.email, club.authorizedUserIds ?? []) && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          value={pendingAuthorizedSelections[club.id] ?? ""}
                          onChange={(event) =>
                            setPendingAuthorizedSelections((prev) => ({
                              ...prev,
                              [club.id]: event.target.value,
                            }))
                          }
                          className="flex-1 rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--accent)"
                        >
                          <option value="">Add authorized user</option>
                          {selectableUsers.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => addAuthorizedUser(club)}
                          className="inline-flex items-center justify-center gap-1 rounded-lg bg-(--accent) px-3 py-2 text-xs font-black uppercase text-(--text-inverse) hover:bg-(--accent-strong)"
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    )}
                  </section>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-(--border) bg-(--surface) p-8 text-center text-(--text-secondary)">
            No clubs are available for your account.
          </div>
        )}
      </div>
    </div>
  );
}
