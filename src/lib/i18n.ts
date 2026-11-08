export const languages = ["en", "ja"] as const;
export type Lang = (typeof languages)[number];

const ui = {
  en: {
    "nav.team": "Team",
    "nav.robot": "Robot",
    "nav.research": "Research",
    "nav.publications": "Publications",
    "nav.software": "Software",
    "nav.achievements": "Achievements",
    "nav.media": "Media",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "lang.switch": "日本語",
    "home.video": "Qualification video",
    "home.explore": "Explore",
    "home.news": "News",
    "home.teamPhoto": "Team photo",
    "card.team": "Members and roles: principal investigator, team leader and contact.",
    "card.robot": "AhaRobot hardware, sensors, computing and abilities.",
    "card.research": "Our approaches and scientific contributions.",
    "card.publications": "Team description papers and publications, with PDFs.",
    "card.software": "Open-source repositories with documentation for other teams.",
    "card.achievements": "RoboCup participation and results.",
    "team.title": "Team",
    "team.pi": "Principal Investigator",
    "team.leader": "Team Leader",
    "team.contact": "Contact Person",
    "team.members": "Members",
    "team.alumni": "Alumni",
    "team.website": "Website",
    "squad.navigation": "Navigation",
    "squad.manipulation": "Manipulation",
    "squad.perception": "Perception",
    "squad.speech": "Speech",
    "squad.tasks": "Task execution",
    "squad.hardware": "Hardware",
    "squad.management": "Management",
    "pubs.title": "Publications",
    "pubs.intro": "Team description papers and publications from the last five years.",
    "pubs.pdf": "PDF",
    "pubs.bibtex": "BibTeX",
    "pubs.doi": "DOI",
    "pubs.link": "Link",
    "pubs.type.tdp": "Team Description Paper",
    "sw.title": "Software",
    "sw.intro": "Repositories we develop and maintain. Each package page explains what it does and how to use it.",
    "sw.repos": "Repositories",
    "sw.license": "License",
    "sw.docs": "Documentation",
    "sw.status.active": "Active",
    "sw.status.maintenance": "Maintenance",
    "sw.status.archived": "Archived",
    "sw.packages": "Packages",
    "research.title": "Research",
    "ach.title": "Achievements",
    "ach.year": "Year",
    "ach.event": "Event",
    "ach.league": "League",
    "ach.result": "Result",
    "media.title": "Media",
    "media.photos": "Photos",
    "media.videos": "Videos",
    "contact.title": "Contact",
    "contact.email": "Email",
    "contact.affiliation": "Affiliation",
    "doc.fallback": "This page is not available in English yet. Showing the Japanese version.",
    "doc.draft": "Draft — hidden on the published site.",
    "doc.repo": "Source code",
    "footer.rights": "All rights reserved.",
  },
  ja: {
    "nav.team": "チーム",
    "nav.robot": "ロボット",
    "nav.research": "研究",
    "nav.publications": "論文",
    "nav.software": "ソフトウェア",
    "nav.achievements": "大会成績",
    "nav.media": "写真・動画",
    "nav.contact": "連絡先",
    "nav.menu": "メニュー",
    "lang.switch": "English",
    "home.video": "資格審査動画",
    "home.explore": "ページ一覧",
    "home.news": "お知らせ",
    "home.teamPhoto": "チーム写真",
    "card.team": "メンバーと役割（PI・チームリーダー・連絡担当）。",
    "card.robot": "AhaRobot のハードウェア、センサ、計算機、できること。",
    "card.research": "取り組んでいる手法と研究成果。",
    "card.publications": "チーム紹介論文（TDP）と発表論文。PDF をダウンロードできます。",
    "card.software": "他のチームも使えるように文書化した公開リポジトリ。",
    "card.achievements": "RoboCup への参加歴と成績。",
    "team.title": "チーム",
    "team.pi": "研究代表者（PI）",
    "team.leader": "チームリーダー",
    "team.contact": "連絡担当",
    "team.members": "メンバー",
    "team.alumni": "OB・OG",
    "team.website": "Webサイト",
    "squad.navigation": "ナビゲーション",
    "squad.manipulation": "マニピュレーション",
    "squad.perception": "認識",
    "squad.speech": "音声",
    "squad.tasks": "タスク実行",
    "squad.hardware": "ハードウェア",
    "squad.management": "運営",
    "pubs.title": "論文",
    "pubs.intro": "チーム紹介論文（TDP）と、過去5年間の発表論文です。",
    "pubs.pdf": "PDF",
    "pubs.bibtex": "BibTeX",
    "pubs.doi": "DOI",
    "pubs.link": "リンク",
    "pubs.type.tdp": "チーム紹介論文（TDP）",
    "sw.title": "ソフトウェア",
    "sw.intro": "開発・保守しているリポジトリです。パッケージごとのページに、何をするものか・使い方をまとめています。",
    "sw.repos": "リポジトリ",
    "sw.license": "ライセンス",
    "sw.docs": "ドキュメント",
    "sw.status.active": "開発中",
    "sw.status.maintenance": "保守のみ",
    "sw.status.archived": "アーカイブ",
    "sw.packages": "パッケージ",
    "research.title": "研究",
    "ach.title": "大会成績",
    "ach.year": "年",
    "ach.event": "大会",
    "ach.league": "リーグ",
    "ach.result": "結果",
    "media.title": "写真・動画",
    "media.photos": "写真",
    "media.videos": "動画",
    "contact.title": "連絡先",
    "contact.email": "メール",
    "contact.affiliation": "所属",
    "doc.fallback": "このページの日本語版はまだありません。英語版を表示しています。",
    "doc.draft": "下書き — 公開サイトには表示されません。",
    "doc.repo": "ソースコード",
    "footer.rights": "All rights reserved.",
  },
} as const;

export type UiKey = keyof (typeof ui)["en"];

export function t(lang: Lang, key: UiKey): string {
  return ui[lang][key] ?? ui.en[key];
}

/** Build a site path for the given language. `path` starts with "/". */
export function localePath(lang: Lang, path: string): string {
  const clean = path === "/" ? "/" : path.replace(/\/+$/, "") + "/";
  return lang === "en" ? clean : `/ja${clean === "/" ? "/" : clean}`;
}

/** Strip the language prefix from a pathname. */
export function stripLang(pathname: string): string {
  const p = pathname.replace(/^\/ja(?=\/|$)/, "");
  return p === "" ? "/" : p;
}

/** Pick the Japanese variant of a field when available. */
export function pick<T extends Record<string, unknown>>(lang: Lang, obj: T, key: string): string | undefined {
  if (lang === "ja") {
    const ja = obj[`${key}_ja`];
    if (typeof ja === "string" && ja) return ja;
  }
  const en = obj[key];
  return typeof en === "string" && en ? en : undefined;
}
