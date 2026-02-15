# CRAai Homepage — 案一覧

株式会社CRAai のブランドサイト（HP）案をまとめたリポジトリです。各案は `proposals/` 配下のフォルダに格納されています。

## 案一覧

| フォルダ | 説明 |
|----------|------|
| [proposals/01-three-abyss](./proposals/01-three-abyss) | Next.js + Three.js + GSAP + Framer Motion。ダーク（abyss）ベース・パーティクル演出・日英切替 |

## 使い方

- 各案は独立した Next.js プロジェクトです。
- 試すときは、該当フォルダに移動してから `npm install` → `npm run dev` を実行してください。

```bash
cd proposals/01-three-abyss
npm install
npm run dev
```

## 新規案の追加

新しいHP案を追加するときは、`proposals/` に新しいフォルダ（例: `02-案名`）を作り、その中に Next.js プロジェクトを配置してください。案が増えたらこの README の「案一覧」に追記してください。
