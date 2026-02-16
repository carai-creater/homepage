# CRAai Homepage — 案一覧

株式会社CRAai のブランドサイト（HP）案をまとめたリポジトリです。各案は `proposals/` 配下のフォルダに格納されています。

## 案一覧

| フォルダ | 説明 |
|----------|------|
| [proposals/01-universe](./proposals/01-universe) | **Universe** — Next.js + Three.js + GSAP + Framer Motion。宇宙風パーティクル・日英切替 |
| [proposals/02-quantum-cat](./proposals/02-quantum-cat) | **Quantum Cat** — 静的サイト（HTML/CSS/JS）。Navy×イエロー、日英切替・横流れプロジェクト |

## 使い方

- 各案は独立した Next.js プロジェクトです。
- 試すときは、該当フォルダに移動してから `npm install` → `npm run dev` を実行してください。

```bash
cd proposals/01-universe
npm install
npm run dev
```

## 新規案の追加

新しいHP案を追加するときは、`proposals/` に新しいフォルダ（例: `02-案名`）を作り、その中に Next.js プロジェクトを配置してください。案が増えたらこの README の「案一覧」に追記してください。
