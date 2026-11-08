# 審査項目とファイルの対応

出典: [RoboCup@Home 2027 Call for Participation](https://athome.robocup.org/call-for-participation-robocuphome-2027/)、
[Submission Review Criteria](https://athome.robocup.org/rules/submission-review-criteria/)。
資格審査の提出締切は **2026-12-06 23:59 GMT**。審査員は公開中のサイトを見る（キャッシュではない）。

`npm run check:content` で、下の表のうちまだ埋まっていない項目が一覧で出る。

| 審査項目 | 求められていること | 埋めるファイル | 表示されるページ |
| --- | --- | --- | --- |
| **H-G1**（合否） | 今年撮った、メンバーの大半と組み上がったロボットが一緒に写った写真 | `site.yaml` の `team_photo` / `team_photo_year` | Home、Team |
| **S-W1**（0–5） | チーム名、PI・Team Leader・Contact Person、所属、ロボット。PI は個人ページへのリンク付き | `site.yaml`、`members/*.md`（`roles: [pi]` と `url`）、`pages/*/robot.md` | Home、Team、Robot、Contact |
| **S-W2**（0–5） | 過去5年の論文。ダウンロードできるリンク付き | `publications.yaml`、`public/papers/*.pdf` | Publications |
| **S-W3**（0–5） | リポジトリへのリンク。活動中で、他チームが使える程度に文書化されている | `software.yaml`、`docs/*/software/*.md` | Software |
| **S-W4**（−2〜+2） | 公開性・コミュニティへの貢献で加点。**動いていないリポジトリを動いているように見せると減点** | `software.yaml` の `status` を正直に | Software |
| **S-T3**（0–5） | TDP・動画・サイトの内容が食い違わない（違うロボット、古い資料など） | `pages/*/robot.md`、`docs/*/research/*.md` を TDP と揃える | Robot、Research |
| CfP | ロボットの写真・動画 | `site.yaml` の `robot_photo`、`media.yaml` | Robot、Media |
| CfP | 手法と研究成果の説明（一般向け） | `docs/*/research/*.md` | Research |
| CfP | 過去の RoboCup 参加歴、ローカル大会と順位 | `achievements.yaml` | Achievements |
| CfP | IP アドレスの URL は不可 | （独自ドメイン https://trail-club.jp で公開） | — |

## 人が用意するもの

- 所属（英語・日本語）、PI・チームリーダー・連絡担当とそれぞれの公開してよい情報
- チーム写真（H-G1）、実機のロボット写真、資格審査動画の YouTube ID
- TDP の PDF と BibTeX
- 大会の参加歴
- AhaRobot リポジトリのルートの LICENSE（S-W3。今は `aha_*` パッケージの package.xml だけが Apache-2.0）
