# 01 — Three.js × Abyss

株式会社CRAai ブランドサイトの一つの案（Next.js App Router + Three.js + GSAP + Framer Motion + Tailwind）

## ディレクトリ構造

```
proposals/01-three-abyss/
├── app/
│   ├── globals.css          # ベース・ユーティリティ（scanline等）
│   ├── layout.tsx           # ルートレイアウト・フォント・LanguageProvider
│   └── page.tsx             # メインページ（Hero / Vision / Mission + GSAP）
├── components/
│   ├── scene/
│   │   ├── index.ts
│   │   ├── Scene.tsx        # R3F Canvas・背景全面・パーティクル統合
│   │   ├── ParticleField.tsx # GLSLパーティクル（マウス連動・スクロール連動）
│   │   └── shaders/
│   │       ├── particle.vert.glsl
│   │       └── particle.frag.glsl
│   └── LanguageSwitcher.tsx # JP/EN切替・走査線演出
├── contexts/
│   └── LanguageContext.tsx   # locale状態・withScanline
├── hooks/
│   └── useScrollProgress.ts # GSAP ScrollTrigger 全体進捗
├── lib/
│   └── i18n/
│       └── content.ts       # 多言語テキスト（ja/en）
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## デザイン

- **ベースカラー**: `#020617` (abyss)
- **アクセント**: `#FACC15` (accent)
- **フォント**: Noto Sans JP（日本語）, Space Grotesk（英語）

## 開発

```bash
cd proposals/01-three-abyss
npm install
npm run dev
```

`http://localhost:3000` で表示。

## 技術スタック

- Next.js (App Router)
- React Three Fiber + Three.js
- GSAP + ScrollTrigger
- Framer Motion
- Tailwind CSS
