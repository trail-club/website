#!/usr/bin/env node
// Checks the site content against the RoboCup@Home qualification criteria.
//
//   npm run check:content   -> prints what is missing (exit 0 unless something is broken)
//   npm run check:strict    -> also fails on anything missing (use before the deadline)
//   --online                -> also checks that software repositories exist on GitHub
//
// "error"   = broken (missing file, bad link): always fails.
// "missing" = required for qualification but not filled in yet: fails only with --strict.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { REQUIREMENTS, SITE_FILE_KEYS, missingFields } from "../src/lib/requirements.mjs";

const root = new URL("..", import.meta.url).pathname;
const strict = process.argv.includes("--strict");
const online = process.argv.includes("--online");
const errors = [];
const missing = [];

const readYaml = (p) => parse(readFileSync(join(root, p), "utf8")) ?? [];
const publicFile = (p) => typeof p === "string" && p.startsWith("/") && existsSync(join(root, "public", p));
const frontmatter = (file) => {
  const m = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/);
  return m ? parse(m[1]) ?? {} : {};
};
const mdFiles = (dir) =>
  existsSync(join(root, dir))
    ? readdirSync(join(root, dir), { recursive: true })
        .filter((f) => f.endsWith(".md") && !f.split("/").pop().startsWith("_"))
        .map((f) => join(root, dir, f))
    : [];

// --- site.yaml: every requirement with site fields (src/lib/requirements.mjs) ---
const site = readYaml("src/data/site.yaml").find((e) => e.id === "main") ?? {};
for (const id of Object.keys(REQUIREMENTS)) {
  for (const f of missingFields(id, site)) missing.push(`site.yaml: ${f.key} — ${f.why}`);
}
for (const key of SITE_FILE_KEYS) {
  if (site[key] && !publicFile(site[key])) errors.push(`site.yaml: ${key} points to a missing file: public${site[key]}`);
}

// --- members (S-W1) ---
const members = mdFiles("src/content/members").map((f) => ({ file: f, ...frontmatter(f) }));
const withRole = (r) => members.filter((m) => (m.roles ?? ["member"]).includes(r));
if (withRole("pi").length === 0) missing.push("members: no member with role pi (Principal Investigator)");
for (const pi of withRole("pi")) if (!pi.url) missing.push(`members: PI ${pi.name} has no url (link to their website is required)`);
if (withRole("leader").length === 0) missing.push("members: no member with role leader (Team Leader)");
if (withRole("contact").length === 0) missing.push("members: no member with role contact (Contact Person)");
for (const m of members) if (m.photo && !publicFile(m.photo)) errors.push(`members: ${m.name} photo is missing: public${m.photo}`);

// --- publications (S-W2) ---
const pubs = readYaml("src/data/publications.yaml");
if (pubs.length === 0) missing.push("publications.yaml: empty — at least the TDP should be listed with a PDF");
const thisYear = new Date().getFullYear();
for (const p of pubs) {
  if (p.pdf && !publicFile(p.pdf)) errors.push(`publications.yaml: ${p.id} pdf is missing: public${p.pdf}`);
  if (!p.pdf && !p.url && !p.doi) missing.push(`publications.yaml: ${p.id} has no download link (pdf, url or doi)`);
  if (p.year < thisYear - 5) missing.push(`publications.yaml: ${p.id} is older than 5 years (${p.year})`);
}
if (!pubs.some((p) => p.type === "tdp")) missing.push("publications.yaml: no TDP (type: tdp)");

// --- software (S-W3, S-W4) ---
const software = readYaml("src/data/software.yaml");
if (software.length === 0) missing.push("software.yaml: no repositories");
for (const s of software) {
  if (!s.docs) missing.push(`software.yaml: ${s.id} has no docs link`);
  if (/TODO/i.test(String(s.license))) missing.push(`software.yaml: ${s.id} license is not decided`);
}
if (online) {
  for (const s of software) {
    try {
      const res = await fetch(s.repo, { method: "HEAD", redirect: "follow" });
      if (!res.ok) errors.push(`software.yaml: ${s.id} repo returned HTTP ${res.status}: ${s.repo}`);
    } catch (e) {
      errors.push(`software.yaml: ${s.id} repo could not be reached: ${s.repo} (${e.message})`);
    }
  }
}

// --- achievements ---
if (readYaml("src/data/achievements.yaml").length === 0) missing.push("achievements.yaml: empty — previous RoboCup / local tournament participation");

// --- media ---
for (const m of readYaml("src/data/media.yaml")) {
  if (m.kind === "photo" && !publicFile(m.src)) errors.push(`media.yaml: ${m.id} file is missing: public${m.src}`);
}

// --- drafts that are still hidden ---
for (const dir of ["src/content/pages", "src/content/docs"]) {
  for (const f of mdFiles(dir)) {
    const fm = frontmatter(f);
    if (fm.draft) missing.push(`draft (hidden on the site): ${f.replace(root, "")}`);
    else if (readFileSync(f, "utf8").includes('class="placeholder"'))
      missing.push(`placeholder left in a published page (hidden, but the section is empty): ${f.replace(root, "")}`);
  }
}

// --- report ---
const print = (label, list) => list.length && console.log(`\n${label} (${list.length})\n` + list.map((l) => `  - ${l}`).join("\n"));
print("ERROR", errors);
print(strict ? "MISSING" : "Not filled in yet", missing);
if (!errors.length && !missing.length) console.log("All qualification items are filled in.");
console.log("");
process.exit(errors.length || (strict && missing.length) ? 1 : 0);
