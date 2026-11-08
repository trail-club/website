// What the site still needs, in one place.
// Used by the "not filled in yet" boxes (src/components/Placeholder.astro)
// and by the content check (scripts/check-content.mjs).
// Plain JavaScript (.mjs) so both Astro and Node can import it.
//
// label / note / edit: shown in the box (Japanese, for team members).
// criterion: the review item, e.g. "S-W1" (see CONTENTS.md).
// fields: keys in src/data/site.yaml that satisfy the requirement, checked in this order.
//   why: English reason printed by the content check; ja: short Japanese name (brand list);
//   file: the value is a path under public/ that must exist.

/**
 * @typedef {{ key: string, why: string, ja?: string, file?: boolean }} Field
 * @typedef {{ label: string, edit: string, note?: string, criterion?: string, fields?: Field[] }} Requirement
 */

const BRAND = "brand asset (Illustrator), see README";

/** @type {Record<string, Requirement>} */
export const REQUIREMENTS = {
  affiliation: {
    label: "所属（大学・研究室）",
    edit: "src/data/site.yaml → affiliation / affiliation_ja",
    criterion: "S-W1",
    fields: [
      { key: "affiliation", why: "S-W1: institutional affiliation" },
      { key: "affiliation_ja", why: "日本語の所属名" },
    ],
  },
  tagline: {
    label: "一般向けの一文の紹介",
    edit: "src/data/site.yaml → tagline / tagline_ja",
    fields: [{ key: "tagline", why: "general-public description (English)" }],
  },
  contactEmail: {
    label: "連絡先メールアドレス",
    edit: "src/data/site.yaml → contact_email",
    criterion: "S-W1",
    fields: [{ key: "contact_email", why: "S-W1: contact" }],
  },
  teamPhoto: {
    label: "チーム集合写真",
    note: "今年撮影した、メンバーの大半と組み上がったロボットが一緒に写った写真",
    edit: "public/images/ に置き、src/data/site.yaml → team_photo / team_photo_year",
    criterion: "H-G1 合否",
    fields: [
      { key: "team_photo", why: "H-G1 (pass/fail): team photo with the assembled robot", file: true },
      { key: "team_photo_year", why: "H-G1: the photo must be from the current qualification year" },
    ],
  },
  video: {
    label: "資格審査動画（YouTube）",
    note: "5つ以上の能力を組み合わせてタスクを解く様子。最大10分、英語または英語字幕。",
    edit: "src/data/site.yaml → qualification_video（YouTube の動画 ID）",
    criterion: "Video",
    fields: [{ key: "qualification_video", why: "qualification video (YouTube id)" }],
  },
  robotPhoto: {
    label: "実機ロボットの写真",
    note: "組み上がった AhaRobot の全身。TDP の写真と同じ構成にする（S-T3）",
    edit: "public/images/ に置き、src/data/site.yaml → robot_photo",
    criterion: "S-W1",
    fields: [{ key: "robot_photo", why: "photo of the real robot", file: true }],
  },
  logo: {
    label: "ロゴ",
    note: "Illustrator で作った横長ロゴ（SVG）。今はチーム名の文字で代用",
    edit: "public/brand/logo.svg に置き、src/data/site.yaml → logo",
    fields: [{ key: "logo", why: BRAND, file: true }],
  },
  brand: {
    label: "ブランド素材（Illustrator で作成）",
    edit: "public/brand/ に書き出し、src/data/site.yaml の各項目。色は src/styles/tokens.css の --accent など",
    fields: [
      { key: "favicon", why: BRAND, ja: "ファビコン（正方形 SVG）→ favicon", file: true },
      { key: "apple_touch_icon", why: BRAND, ja: "ホーム画面用アイコン（180×180 PNG）→ apple_touch_icon", file: true },
      { key: "og_image", why: BRAND, ja: "SNS 共有用の画像（1200×630 PNG）→ og_image", file: true },
    ],
  },

  // Not in site.yaml: checked by their own rules in scripts/check-content.mjs
  pi: {
    label: "研究代表者（PI）",
    note: "指導教員など。個人・研究室ページへのリンク（url）が必要",
    edit: "src/content/members/<name>.md → roles: [pi]",
    criterion: "S-W1",
  },
  leader: {
    label: "チームリーダー",
    note: "1人のメンバーが連絡担当を兼ねてもよい",
    edit: "src/content/members/<name>.md → roles: [leader]",
    criterion: "S-W1",
  },
  contact: {
    label: "連絡担当",
    note: "大会運営からの連絡を受ける人",
    edit: "src/content/members/<name>.md → roles: [contact]",
    criterion: "S-W1",
  },
  members: {
    label: "メンバー一覧（1人1ファイル）",
    note: "名前、日本語名、役割、班、学年、顔写真（任意）、GitHub",
    edit: "src/content/members/_template.md をコピーして <name>.md を作る",
    criterion: "S-W1",
  },
  tdp: {
    label: "TDP（Team Description Paper）の PDF",
    note: "最大8ページ＋付録2ページ、Springer LNAI 形式。BibTeX も付ける",
    edit: "public/papers/ に PDF を置き、src/data/publications.yaml に type: tdp で追加",
    criterion: "S-W2",
  },
  publications: {
    label: "過去5年の論文・発表",
    note: "学会発表、論文、プレプリント、卒論・修論など。ダウンロードできるリンク（pdf / url / doi）付き",
    edit: "src/data/publications.yaml",
    criterion: "S-W2",
  },
  achievements: {
    label: "大会の参加歴と順位",
    note: "RoboCup 世界大会、Japan Open、その他の大会・競技会。年、大会名、リーグ、結果",
    edit: "src/data/achievements.yaml",
    criterion: "CfP / 審査",
  },
  news: {
    label: "お知らせ（大会への出場決定、結果など）",
    edit: "src/content/news/<lang>/YYYY-MM-DD-slug.md（_template.md をコピー）",
  },
  robotVideo: {
    label: "ロボットの動画（YouTube）",
    note: "タスクのデモ、大会での様子など",
    edit: "src/data/media.yaml → kind: video, src: <YouTube ID>",
  },
};

/** site.yaml keys whose value is a file under public/ */
export const SITE_FILE_KEYS = Object.values(REQUIREMENTS).flatMap((r) => (r.fields ?? []).filter((f) => f.file).map((f) => f.key)).concat("logo_dark");

/** Fields of a requirement that are still empty in site data. */
export function missingFields(id, site) {
  return (REQUIREMENTS[id].fields ?? []).filter((f) => site[f.key] === undefined || site[f.key] === null || site[f.key] === "");
}
