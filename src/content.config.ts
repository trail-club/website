import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

// Optional strings: an empty YAML value ("") is treated as missing, so a
// field can be left blank in the data files without breaking the build.
const optText = z.preprocess((v) => (v === "" || v === null ? undefined : v), z.string().optional());
const optInt = z.preprocess((v) => (v === "" || v === null ? undefined : v), z.number().int().optional());
const optUrl = z.preprocess((v) => (v === "" || v === null ? undefined : v), z.url().optional());

const site = defineCollection({
  loader: file("src/data/site.yaml"),
  schema: z.object({
    team_name: z.string(),
    league: z.string(),
    robot_name: z.string(),
    affiliation: optText,
    affiliation_ja: optText,
    affiliation_url: optUrl,
    tagline: optText,
    tagline_ja: optText,
    contact_email: optText,
    github: optUrl,
    youtube: optUrl,
    x: optUrl,
    instagram: optUrl,
    // Path under public/, e.g. /images/team-2026.jpg
    team_photo: optText,
    team_photo_year: optInt,
    team_photo_caption: optText,
    team_photo_caption_ja: optText,
    robot_photo: optText,
    // Brand assets made in Illustrator (paths under public/brand/)
    logo: optText,
    logo_dark: optText,
    favicon: optText,
    apple_touch_icon: optText,
    og_image: optText,
    // YouTube video id of the qualification video (the part after v=)
    qualification_video: optText,
  }),
});

const members = defineCollection({
  loader: glob({ pattern: "[!_]*.md", base: "src/content/members" }),
  schema: z.object({
    name: z.string(),
    name_ja: optText,
    roles: z.array(z.enum(["pi", "leader", "contact", "member", "alumni"])).default(["member"]),
    squad: z.enum(["navigation", "manipulation", "perception", "speech", "tasks", "hardware", "management"]).optional(),
    position: optText,
    position_ja: optText,
    affiliation: optText,
    url: optUrl,
    github: optText,
    photo: optText,
    order: z.number().default(100),
  }),
});

const publications = defineCollection({
  loader: file("src/data/publications.yaml"),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number().int(),
    type: z.enum(["tdp", "conference", "journal", "workshop", "preprint", "thesis", "other"]),
    // Path under public/, e.g. /papers/trail-tdp-2027.pdf
    pdf: optText,
    url: optUrl,
    doi: optText,
    bibtex: optText,
  }),
});

const software = defineCollection({
  loader: file("src/data/software.yaml"),
  schema: z.object({
    name: z.string(),
    repo: z.url(),
    description: z.string(),
    description_ja: optText,
    license: z.string(),
    docs: optUrl,
    // Shown as-is to reviewers. Do not mark a repository active unless it is.
    status: z.enum(["active", "maintenance", "archived"]),
    tags: z.array(z.string()).default([]),
  }),
});

const achievements = defineCollection({
  loader: file("src/data/achievements.yaml"),
  schema: z.object({
    year: z.number().int(),
    event: z.string(),
    event_ja: optText,
    league: z.string(),
    result: z.string(),
    result_ja: optText,
    url: optUrl,
  }),
});

const media = defineCollection({
  loader: file("src/data/media.yaml"),
  schema: z.object({
    kind: z.enum(["photo", "video"]),
    // photo: path under public/; video: YouTube video id
    src: z.string(),
    caption: z.string(),
    caption_ja: optText,
    year: optInt,
  }),
});

// Long-form single pages (e.g. robot.md), one file per language.
const pages = defineCollection({
  loader: glob({ pattern: "**/[!_]*.md", base: "src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: optText,
    draft: z.boolean().default(false),
  }),
});

// Sidebar documentation for Research and Software, one file per language.
const docs = defineCollection({
  loader: glob({ pattern: "**/[!_]*.md", base: "src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: optText,
    order: z.number().default(100),
    repo: optUrl,
    draft: z.boolean().default(false),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/[!_]*.md", base: "src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { site, members, publications, software, achievements, media, pages, docs, news };
