import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import type { Lang } from "./i18n";

/** Drafts are shown in `astro dev` and hidden from the built site. */
export const showDrafts = import.meta.env.DEV;

/**
 * "Not filled in yet" boxes. On in `astro dev`; for a build that shows them,
 * run `SHOW_PLACEHOLDERS=true npm run build`. Never deploy with them on.
 */
export const showPlaceholders = import.meta.env.DEV || process.env.SHOW_PLACEHOLDERS === "true";

export async function getSite() {
  const entry = await getEntry("site", "main");
  if (!entry) throw new Error("src/data/site.yaml must contain an entry with id: main");
  return entry.data;
}

type DocSection = "research" | "software";
export type DocEntry = CollectionEntry<"docs">;

function splitDocId(id: string) {
  const [lang, section, ...rest] = id.split("/");
  // The glob loader drops a trailing "/index", so "en/software/index.md" has the id "en/software".
  return { lang: lang as Lang, section, slug: rest.join("/") || "index" };
}

/**
 * Docs of one section for a language. A page missing in that language
 * falls back to the other language and is flagged with `fallback`.
 */
export async function listDocs(lang: Lang, section: DocSection) {
  const all = await getCollection("docs", (e) => showDrafts || !e.data.draft);
  const bySlug = new Map<string, { entry: DocEntry; slug: string; fallback: boolean }>();
  for (const entry of all) {
    const d = splitDocId(entry.id);
    if (d.section !== section) continue;
    const prev = bySlug.get(d.slug);
    const isOwn = d.lang === lang;
    if (!prev || (isOwn && prev.fallback)) bySlug.set(d.slug, { entry, slug: d.slug, fallback: !isOwn });
  }
  return [...bySlug.values()].sort(
    (a, b) => a.entry.data.order - b.entry.data.order || a.entry.data.title.localeCompare(b.entry.data.title),
  );
}

/** A single long-form page (src/content/pages/<lang>/<slug>.md) with fallback. */
export async function getPage(lang: Lang, slug: string) {
  const other: Lang = lang === "en" ? "ja" : "en";
  for (const [l, fallback] of [
    [lang, false],
    [other, true],
  ] as const) {
    const entry = await getEntry("pages", `${l}/${slug}`);
    if (entry && (showDrafts || !entry.data.draft)) return { entry, fallback };
  }
  return undefined;
}

export async function getNews(lang: Lang) {
  const all = await getCollection("news", (e) => (showDrafts || !e.data.draft) && e.id.startsWith(`${lang}/`));
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

const roleOrder = ["pi", "leader", "contact", "member", "alumni"] as const;

export type Member = CollectionEntry<"members">;
export type Role = (typeof roleOrder)[number];

export async function getMembers() {
  const all = await getCollection("members");
  const rank = (m: Member) => Math.min(...m.data.roles.map((r) => roleOrder.indexOf(r)));
  return all.sort((a, b) => rank(a) - rank(b) || a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

export function membersWithRole(members: Member[], role: Role) {
  return members.filter((m) => m.data.roles.includes(role));
}

/** "山田 太郎（Taro Yamada）" in Japanese when a Japanese name is set, otherwise the original name. */
export function displayName(lang: Lang, m: Member) {
  return lang === "ja" && m.data.name_ja ? `${m.data.name_ja}（${m.data.name}）` : m.data.name;
}

export async function getPublications() {
  const all = await getCollection("publications");
  return all.sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title));
}

export async function getAchievements() {
  const all = await getCollection("achievements");
  return all.sort((a, b) => b.data.year - a.data.year);
}

export function youtubeEmbed(id: string) {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
}
