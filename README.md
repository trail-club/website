# TRAIL チームサイト

RoboCup@Home OPL に出場するチーム TRAIL の Web サイト（https://trail-club.jp）。
このサイトは資格審査の提出物の1つで、点数がつく。何をどこに書けば審査項目を満たすかは [CONTENTS.md](CONTENTS.md) を参照。

## 手元で見る

Node.js 22.23 以上が必要。

```bash
npm install
npm run dev            # http://localhost:4321 。下書き（draft: true）も表示される
npm run build          # dist/ に公開用のファイルを作る。下書きは含まれない
npm run preview        # build した結果を表示する
npm run typecheck      # 型チェック（PR でも自動で走る）
npm run check:content  # 審査項目のうち、まだ埋まっていないものを一覧にする
npm run check:strict   # 埋まっていない項目があれば失敗する（締切前に使う）
```

`build` のときに出る `The collection "..." does not exist or is empty` という警告は、そのデータがまだ空なだけで問題ない。

## 書き方

文章は Markdown、一覧は YAML で書く。英語版と日本語版の2つがあり、URL は英語が `/`、日本語が `/ja/`。

| 何を変えるか | ファイル |
| --- | --- |
| チーム名・所属・連絡先・チーム写真・資格審査動画 | `src/data/site.yaml` |
| メンバー（1人1ファイル） | `src/content/members/<name>.md`（`_template.md` をコピー） |
| 論文・TDP | `src/data/publications.yaml` と `public/papers/*.pdf` |
| 公開リポジトリ | `src/data/software.yaml` |
| 大会成績 | `src/data/achievements.yaml` |
| 写真・動画 | `src/data/media.yaml` と `public/images/` |
| ロボットの説明 | `src/content/pages/{en,ja}/robot.md` |
| 研究・パッケージの解説 | `src/content/docs/{en,ja}/{research,software}/*.md` |
| お知らせ | `src/content/news/{en,ja}/*.md` |
| 色・フォント・余白 | `src/styles/tokens.css` |
| ナビやボタンの文言 | `src/lib/i18n.ts` |
| ページの一覧（ナビと Home のカード） | `src/lib/pages.ts` |
| 審査で必要な項目（「未入力」の枠と内容チェックの文言） | `src/lib/requirements.mjs` |

- `_` で始まるファイルはテンプレートで、サイトには出ない。
- Markdown の先頭に `draft: true` があると、`npm run dev` では見えるが公開サイトには出ない。書き終えたら消す。
- 日本語版が無いページは英語版を表示し、その旨を注記する（逆も同じ）。
- 値が空（`""`）の項目は表示されない。「準備中」とは書かない（作りかけのサイトは審査で減点される）。

### 「未入力」の枠

`npm run dev` で見ると、まだ埋まっていない場所に青い点線の枠が出る（サイトの緑・オレンジと混ざらない色にしてある）。枠には、そこに入るもの、関係する審査項目、編集するファイルが書いてある。

- 値を入れると枠は自動で消える。枠のコードを消す必要はない。
- 枠の文言（何が入るか、審査項目、編集する場所）は `src/lib/requirements.mjs` にまとめてあり、`npm run check:content` も同じ定義を使う。項目を増やすときはここに足し、ページでは `<Placeholder req="項目の id" />` と書く。
- 公開用の build（`npm run build`）には出ない。公開サイトで見たいときだけ `SHOW_PLACEHOLDERS=true npm run build` を使う（これをデプロイしないこと）。
- Markdown の本文では `<div class="placeholder">ここに入るもの</div>` と書くと同じ枠になる。本文を書いたらこの行を消す。下書きでないページに残っていると `npm run check:content` が知らせる。

## ロゴ

ロゴは「AhaRobot が坂を登りながらオレンジの物を掲げる絵」と「TRAIL·club」の文字の組み合わせ（G1 案）。
文字で書くチーム名は **TRAIL Club**。

| ファイル | 中身 | 使う場所 |
| --- | --- | --- |
| `design/logo/trail-club-logo.ai` | 確定版の Illustrator ファイル（用途ごとのアートボード） | 編集の元 |
| `public/brand/logo.svg` | 横組み、明るい背景用 | ヘッダー（高さ 40px） |
| `public/brand/logo-dark.svg` | 横組み、暗い背景用 | ダークモードのヘッダー |
| `public/brand/logo-mono.svg` | 1色（緑） | 印刷・Tシャツなど |
| `public/brand/mark.svg` | 絵だけ（正方形） | SNS のアイコンなど |
| `public/brand/favicon.svg` | RealSense の頭だけ | ブラウザのタブ |
| `public/brand/apple-touch-icon.png` | 180×180 | スマホのホーム画面 |
| `public/brand/og.png` | 1200×630 | SNS で共有したときの画像 |
| `design/logo-proposals/trail-club-logo-proposals.ai` | 検討した全案（A・B・R・F・G） | 記録 |

ロゴは Illustrator のスクリプトで描いている（`design/logo/scripts/`）。形を変えるときは `g1.jsx` を直して次を実行すると、
`.ai` を描き直し、上の `public/brand/` のファイルも作り直す（Illustrator が必要）。

```bash
design/logo/scripts/run.sh
```

配色:

| 名前 | 色 | 使い方 |
| --- | --- | --- |
| 苔色 | `#3D5A2A` | ロゴ、リンク、強調 |
| オレンジ | `#D4602A` | ロゴのアクセント、小さな強調だけ（明るい背景では文字に使わない。コントラストが 3.6:1 しかない） |
| 生成り | `#F2EFE2` | ロゴの背景、暗い背景用ロゴの色 |

サイトの色は `src/styles/tokens.css` にまとめてある。色を変えるときは、文字と背景のコントラスト比 4.5:1 以上を守る。

## 公開

`main` に merge すると GitHub Actions（`.github/workflows/deploy.yml`）が build して GitHub Pages に公開する。
PR では `.github/workflows/check.yml` が内容チェック、build、リンク切れチェックを行う。
締切前はリポジトリの変数 `STRICT_CONTENT` を `true` にすると、未記入の項目があれば PR が失敗する。

### 初回だけ必要な設定

1. GitHub: リポジトリの Settings → Pages → Source を **GitHub Actions** にする。
2. GitHub: org の Settings → Pages で `trail-club.jp` を verified domain にする（表示される TXT レコードを DNS に追加）。
3. DNS（trail-club.jp）:
   - apex `trail-club.jp`: A レコード `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - apex `trail-club.jp`: AAAA レコード `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `www.trail-club.jp`: CNAME `trail-club.github.io`
4. GitHub: リポジトリの Settings → Pages → Custom domain に `trail-club.jp` を入れ、DNS の確認が済んだら **Enforce HTTPS** を ON にする。
5. 確認: `dig trail-club.jp +short` で上の IP が返り、https://trail-club.jp と https://trail-club.jp/ja/ が開くこと。
