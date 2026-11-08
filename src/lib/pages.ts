import type { UiKey } from "./i18n";

/**
 * Site pages in navigation order. `card` = description key for the card on the home page
 * (pages without a card are only in the navigation).
 */
export const PAGES = [
  { path: "/team", key: "nav.team", card: "card.team" },
  { path: "/robot", key: "nav.robot", card: "card.robot" },
  { path: "/research", key: "nav.research", card: "card.research" },
  { path: "/publications", key: "nav.publications", card: "card.publications" },
  { path: "/software", key: "nav.software", card: "card.software" },
  { path: "/achievements", key: "nav.achievements", card: "card.achievements" },
  { path: "/media", key: "nav.media" },
  { path: "/contact", key: "nav.contact" },
] as const satisfies readonly { path: string; key: UiKey; card?: UiKey }[];
