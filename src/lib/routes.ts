import { listDocs } from "./content";
import type { Lang } from "./i18n";

/** getStaticPaths for /<section>/<slug> doc pages in one language. */
export async function docPaths(lang: Lang, section: "research" | "software") {
  const docs = await listDocs(lang, section);
  return docs
    .filter((d) => d.slug !== "index")
    .map((d) => ({ params: { slug: d.slug }, props: { slug: d.slug, entry: d.entry, fallback: d.fallback } }));
}
