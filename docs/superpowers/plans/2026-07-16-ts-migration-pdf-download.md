# TypeScript移行 + PDFダウンロードボタン 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** LP全体（15ファイル）をTypeScriptへ移行し、ヘッダーに内覧会資料PDFのダウンロードボタンを追加する。

**Architecture:** Next.js 16 App Router のLP。TS移行は挙動を変えず型付け＋リネームのみ（`allowJs: true` で段階移行し、各コミットでビルドが通る状態を維持）。PDFは `public/docs/` に静的配置し、`next.config.mjs` の `headers()` でセキュリティヘッダーを付与。

**Tech Stack:** Next.js 16.2.10 / React 19 / TypeScript(strict) / three.js + @react-three/fiber v9 / Vercel

**スペック:** `docs/superpowers/specs/2026-07-16-ts-migration-pdf-download-design.md`

## Global Constraints

- 挙動変更・リファクタリング禁止。型付け・リネーム・仕様に明記した追加のみ
- `strict: true`、`any` 禁止（`unknown` を使う）、エクスポート関数にJSDoc
- 各タスク末尾で `npm run build` と `npm run lint` が通ること。コミット前に必ずlint
- 1タスク=1コミット。push禁止（ユーザー確認後）
- 修正試行は最大5回。解決しなければ報告して停止
- テスト基盤は導入しない（LPでテストなし運用。検証は build / lint / dev確認）
- PDFのDL用URL名: `/docs/kuki-logic-viewing-guide.pdf`、保存ファイル名(日本語): `久喜LOGIC内覧会資料.pdf`
- ラベル切替ブレークポイントは既存基準の `max-width: 760px`

**所要目安:** Task 1: 10分 / Task 2: 10分 / Task 3: 25分 / Task 4: 10分 / Task 5: 20分 / Task 6: 25分 / Task 7: 15分 / Task 8: 20分 / 合計 約2時間

---

### Task 1: TypeScript環境設定

**Files:**
- Modify: `package.json`（devDependencies追加）
- Create: `tsconfig.json`
- Delete: `jsconfig.json`

**Interfaces:**
- Produces: `@/*` パスエイリアス（tsconfig.jsonに引き継ぎ）、`allowJs: true` により未変換の `.js` と共存可能

- [ ] **Step 1: 依存を追加**

```bash
cd /Users/ss/Dev/logic-kuki
npm install -D typescript @types/react @types/react-dom @types/node
```

- [ ] **Step 2: jsconfig.jsonを削除し、tsconfig.jsonを作成**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

```bash
rm jsconfig.json
```

- [ ] **Step 3: ビルドで検証**

Run: `npm run build`
Expected: 成功。`next-env.d.ts` が自動生成される（これもコミット対象）。

Run: `npm run lint`
Expected: エラー0

- [ ] **Step 4: コミット**

```bash
git add package.json package-lock.json tsconfig.json next-env.d.ts
git rm jsconfig.json
git commit -m "chore: TypeScript環境を導入（tsconfig追加・型定義パッケージ）"
```

---

### Task 2: app/ の移行（layout・page）

**Files:**
- Rename+Modify: `app/layout.js` → `app/layout.tsx`
- Rename: `app/page.js` → `app/page.tsx`

**Interfaces:**
- Consumes: Task 1のtsconfig
- Produces: なし（後続タスクから参照されない）

- [ ] **Step 1: layout.tsxへ変換**

`git mv app/layout.js app/layout.tsx` 後、次の内容に変更（JSX部分は無変更）:

```tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: '久喜LOGIC | 埼玉県久喜市 竣工前内覧会受付中',
  description: '梁下5.5m、無柱の倉庫棟3,590坪。首都圏と東北をつなぐ新しい物流拠点、久喜LOGICの竣工前内覧会受付中。',
};

/**
 * 全ページ共通のルートレイアウト。Googleフォントの読み込みとhtml/body枠を提供する。
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  // ...既存のJSXをそのまま維持（<html lang="ja"> 以下、変更しない）
}
```

- [ ] **Step 2: page.tsxへ変換**

```bash
git mv app/page.js app/page.tsx
```

中身の変更は不要（import群とJSXのみのため）。関数にJSDocを1行追加:

```tsx
/**
 * トップページ。背景3Dシーン・ナビ・各セクションを組み立てる。
 */
export default function Home() {
```

- [ ] **Step 3: 検証**

Run: `npm run build && npm run lint`
Expected: 両方成功

- [ ] **Step 4: コミット**

```bash
git add -A app/
git commit -m "refactor: app配下をTypeScriptに移行"
```

---

### Task 3: 単純コンポーネント9ファイルの移行

**Files:**
- Rename+Modify: `components/Access.js` `components/AreaGuide.js` `components/Footer.js` `components/Gallery.js` `components/Spec.js` `components/Statement.js` `components/Viewing.js` `components/Zoning.js` `components/ScrollReveal.js` → 各 `.tsx`

**Interfaces:**
- Consumes: Task 1のtsconfig
- Produces: なし

**共通パターン（全ファイル適用）:**

1. `git mv components/X.js components/X.tsx`
2. データ配列に型を付ける（例）:

```tsx
type AccessItem = { name: string; note: string; dist: string };

const ACCESS_ITEMS: AccessItem[] = [ /* 既存データそのまま */ ];
```

3. エクスポート関数にJSDocを追加（例: `/** アクセスセクション。ICと駅への距離を一覧表示する。 */`）
4. **CSSカスタムプロパティのstyleは型エラーになる**ため、該当箇所（Access/AreaGuide/Gallery/Spec/Statement/Viewing/Zoningの `--reveal-delay`）は次の形にキャストする:

```tsx
import type { CSSProperties } from 'react';

style={{ '--reveal-delay': `${i * 70}ms` } as CSSProperties}
```

（数値はファイルごとの既存値 70/80/90/60 を維持。**値を変えない**）

**ファイル別の型定義:**

```tsx
// AreaGuide.tsx
type AreaPoint = { n: string; title: string; desc: string };
// Gallery.tsx
type GalleryImage = { num: string; name: string; src: string; alt: string };
// Spec.tsx
type SpecItem = { icon: string; value: string; unit: string; desc: string };
// Statement.tsx
type Stat = { num: string; unit: string; label: string };
// Viewing.tsx
type ViewingDate = { dow: string; md: string; time: string };
// Zoning.tsx
type Zone = { name: string; tag: string; rows: [string, string][]; rent: string };
// Footer.tsx: データ配列なし、JSDoc追加のみ
```

**ScrollReveal.tsx** は戻り値型を明示:

```tsx
/**
 * [data-reveal]要素を監視し、初回表示時に .is-revealed を付与する（ワンショット）。
 */
export default function ScrollReveal(): null {
  // useEffect内は無変更（IntersectionObserver処理）
  return null;
}
```

- [ ] **Step 1: 9ファイルをリネームし上記パターンで型付け**
- [ ] **Step 2: 検証**

Run: `npm run build && npm run lint`
Expected: 両方成功

- [ ] **Step 3: コミット**

```bash
git add -A components/
git commit -m "refactor: 単純コンポーネント9件をTypeScriptに移行"
```

---

### Task 4: ScrollChrome の移行

**Files:**
- Rename+Modify: `components/ScrollChrome.js` → `components/ScrollChrome.tsx`

**Interfaces:**
- Produces: Task 8 がこのファイルにDLボタンを追加する（構造は現状維持）

- [ ] **Step 1: 型付け**

変更点は以下のみ（ロジック・JSX無変更）:

```tsx
import { useEffect, useRef, useState, type MouseEvent } from 'react';

/**
 * 固定ナビ・スクロール進捗レール・トップに戻るボタン。
 * スクロール量に応じてナビの見た目と進捗を更新する。
 */
export default function ScrollChrome() {
  const navRef = useRef<HTMLElement | null>(null);        // <nav>
  const railFillRef = useRef<HTMLDivElement | null>(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  // useEffect内は無変更

  /** ロゴ・トップに戻るボタン押下時にページ最上部へスムーズスクロールする。 */
  function scrollToTop(e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // JSXは無変更
}
```

- [ ] **Step 2: 検証**

Run: `npm run build && npm run lint`
Expected: 両方成功

- [ ] **Step 3: コミット**

```bash
git add -A components/ScrollChrome.tsx
git commit -m "refactor: ScrollChromeをTypeScriptに移行"
```

---

### Task 5: Hero の移行

**Files:**
- Rename+Modify: `components/Hero.js` → `components/Hero.tsx`

- [ ] **Step 1: 型付け**

変更点（ロジック・JSX・数値は一切変えない）:

```tsx
// ヘルパー関数: 引数・戻り値を number で型付け
function lerp(a: number, b: number, t: number): number { ... }
function clamp(v: number, min: number, max: number): number { ... }
function easeOutCubic(t: number): number { ... }
function rangeProgress(v: number, start: number, end: number): number { ... }
function fadeWindow(p: number, inStart: number, inEnd: number, outStart: number, outEnd: number): number { ... }

// pause状態の型
type PauseState = {
  locked: boolean;
  lastP: number;
  triggered: boolean[];
  timer: ReturnType<typeof setTimeout> | null;
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);      // <section>
  const photoRef = useRef<HTMLDivElement | null>(null);
  const bracketsRef = useRef<HTMLDivElement | null>(null);
  const copy1Ref = useRef<HTMLDivElement | null>(null);
  const copy2Ref = useRef<HTMLDivElement | null>(null);
  const copy3Ref = useRef<HTMLDivElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);
  const [heroVh, setHeroVh] = useState<number>(HERO_VH_DESKTOP);
  const pauseRef = useRef<PauseState>({ locked: false, lastP: 0, triggered: PAUSE_POINTS.map(() => false), timer: null });
```

useEffect内の型対応（値・挙動は同一）:

```tsx
function lockScrollAt(targetY: number) {
  // clearTimeout は null を受けないため ?? undefined を挟む（挙動同一）
  clearTimeout(state.timer ?? undefined);
  ...
}

// wheel/touchmove の抑止ハンドラ
function blockIfLocked(e: WheelEvent | TouchEvent) {
  if (pauseRef.current.locked) {
    e.preventDefault();
  }
}

// クリーンアップ内も同様
clearTimeout(pauseState.timer ?? undefined);
```

- [ ] **Step 2: 検証**

Run: `npm run build && npm run lint`
Expected: 両方成功。加えて `npm run dev` でヒーローのスクロール演出（コピー切替・一時停止）が従来どおり動くこと。

- [ ] **Step 3: コミット**

```bash
git add -A components/Hero.tsx
git commit -m "refactor: HeroをTypeScriptに移行"
```

---

### Task 6: three.js系（WarehouseDots・BackgroundScene）の移行

**Files:**
- Rename+Modify: `components/demo/WarehouseDots.js` → `components/demo/WarehouseDots.tsx`
- Rename+Modify: `components/BackgroundScene.js` → `components/BackgroundScene.tsx`

**Interfaces:**
- Produces: `WarehouseDots({ scrollRef }: { scrollRef?: RefObject<ScrollState> })` / `warehouseDotsCamera`（BackgroundSceneが消費）
- Produces: `ScrollState = { p: number; extra: number }`（WarehouseDots.tsxで定義・export）

- [ ] **Step 1: WarehouseDots.tsxの型付け**

変更点:

```tsx
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { RefObject } from 'react';

/** 背景シーンがフレーム毎に読むスクロール状態。 */
export type ScrollState = { p: number; extra: number };

function lerp(a: number, b: number, t: number): number { ... }
function easeOutCubic(t: number): number { ... }

// 面の型（quad=4点 / tri=3点）
type Face = { type: 'quad' | 'tri'; pts: THREE.Vector3[] };
type FaceWithArea = Face & { area: number };

function buildWarehouseFaces(): FaceWithArea[] {
  // 中身は無変更。quad/triヘルパーに戻り値型 Face を付ける
  const quad = (p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): Face => ({ type: 'quad', pts: [p0, p1, p2, p3] });
  const tri = (p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3): Face => ({ type: 'tri', pts: [p0, p1, p2] });
  function faceArea(f: Face): number { ... }
}

function samplePointOnFace(face: Face): THREE.Vector3 { ... }
function sampleAmbientPoint(): [number, number, number] { ... }
function useAmbientPoints(): Float32Array { ... }
function useWarehousePoints(): { positions: Float32Array; flicker: Float32Array } { ... }

function WarehousePoints() {
  const pointsRef = useRef<THREE.Points | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const ambientRef = useRef<THREE.Group | null>(null);
  const material = useRef<THREE.PointsMaterial | null>(null);
  // useFrame内・JSXは無変更
}

/** スクロール進捗に合わせてカメラを動かすリグ。 */
function CameraRig({ scrollRef }: { scrollRef?: RefObject<ScrollState> }) {
  // useThree() の camera は THREE.Camera 型で fov を持たないため、
  // 実体（PerspectiveCamera）にキャストして扱う（挙動同一）
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  ...
}

/** 倉庫型ドットフィールド全体。 */
export default function WarehouseDots({ scrollRef }: { scrollRef?: RefObject<ScrollState> }) { ... }

export const warehouseDotsCamera = { position: [0, 4.5, 20] as [number, number, number], fov: 52 };
```

**注意:** `<bufferAttribute attach="attributes-position" count array itemSize>` のprops指定でr3f v9の型エラーが出た場合のみ、`args={[positions, 3]}`（コンストラクタ引数形式、ランタイム同一）に置き換える。それ以外の理由でJSX構造を変えない。

- [ ] **Step 2: BackgroundScene.tsxの型付け**

変更点:

```tsx
import WarehouseDots, { warehouseDotsCamera, type ScrollState } from './demo/WarehouseDots';

export default function BackgroundScene() {
  const scrollRef = useRef<ScrollState>({ p: 0, extra: 0 });

  // useEffect内: querySelector の戻りは HTMLElement として扱う
  const hero = document.querySelector<HTMLElement>('.hero-scroll');
  // 以降無変更（offsetHeight参照のため型引数が必要）
}
```

- [ ] **Step 3: 検証**

Run: `npm run build && npm run lint`
Expected: 両方成功。`npm run dev` で背景のドットフィールド（回転・スクロール連動カメラ）が従来どおり表示されること。

- [ ] **Step 4: コミット（TS移行完了）**

```bash
git add -A components/
git commit -m "refactor: three.js系コンポーネントをTypeScriptに移行"
```

---

### Task 7: PDF配置とセキュリティヘッダー

**Files:**
- Create: `public/docs/kuki-logic-viewing-guide.pdf`
- Modify: `next.config.mjs`

**Interfaces:**
- Produces: URL `/docs/kuki-logic-viewing-guide.pdf`（Task 8のボタンhrefが消費）

- [ ] **Step 1: PDFメタデータの確認**

```bash
mdls -name kMDItemAuthors -name kMDItemCreator -name kMDItemTitle "/Users/ss/Desktop/久喜LOGIC内覧会資料_20260714.pdf"
```

個人名・社内情報など意図しないメタデータがあれば **ユーザーに報告して除去可否を確認**（除去する場合は `exiftool -all= -overwrite_original <コピー先>`。exiftool未導入なら `brew install exiftool`）。問題なければそのまま進む。

- [ ] **Step 2: PDFを配置**

```bash
mkdir -p /Users/ss/Dev/logic-kuki/public/docs
cp "/Users/ss/Desktop/久喜LOGIC内覧会資料_20260714.pdf" /Users/ss/Dev/logic-kuki/public/docs/kuki-logic-viewing-guide.pdf
```

- [ ] **Step 3: next.config.mjsにheadersを追加**

保存ファイル名のRFC 5987エンコード値を生成して使う:

```bash
node -e "console.log(encodeURIComponent('久喜LOGIC内覧会資料.pdf'))"
# => %E4%B9%85%E5%96%9CLOGIC%E5%86%85%E8%A6%A7%E4%BC%9A%E8%B3%87%E6%96%99.pdf
```

`next.config.mjs` 全文:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // 内覧会資料PDF: ブラウザ内表示させず確実にダウンロードさせる。
        // 保存時のファイル名は日本語（RFC 5987形式でエンコード済み）
        source: '/docs/:path*',
        headers: [
          {
            key: 'Content-Disposition',
            value:
              "attachment; filename*=UTF-8''%E4%B9%85%E5%96%9CLOGIC%E5%86%85%E8%A6%A7%E4%BC%9A%E8%B3%87%E6%96%99.pdf",
          },
          // MIMEスニッフィング防止
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // 資料差し替え時に古いキャッシュが残りすぎないよう1時間
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 4: ヘッダー動作を検証**

```bash
npm run dev &
sleep 5
curl -sI http://localhost:3000/docs/kuki-logic-viewing-guide.pdf | grep -i -E "content-disposition|x-content-type|cache-control|content-type"
```

Expected:
```
content-type: application/pdf
content-disposition: attachment; filename*=UTF-8''%E4%B9%85...（上記の値）
x-content-type-options: nosniff
cache-control: public, max-age=3600
```

確認後devサーバーを停止。`npm run build && npm run lint` も成功すること。

- [ ] **Step 5: コミット**

```bash
git add public/docs/kuki-logic-viewing-guide.pdf next.config.mjs
git commit -m "feat: 内覧会資料PDFを配置しセキュリティヘッダーを設定"
```

---

### Task 8: ヘッダーにDLボタン追加（PC/SPラベル切替）

**Files:**
- Modify: `components/ScrollChrome.tsx`（Task 4で移行済み）
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `/docs/kuki-logic-viewing-guide.pdf`（Task 7）

- [ ] **Step 1: ScrollChrome.tsxのnav右側を変更**

現在の

```tsx
<a className="nav-cta" href="#viewing">
  内覧会に申し込む →
</a>
```

を、DLボタン（左）＋申込ボタン（右）のグループに置き換える:

```tsx
<div className="nav-actions">
  {/* 内覧会資料PDFのダウンロード（セカンダリ）。PC/SPでラベルをCSS切替 */}
  <a
    className="nav-cta nav-cta--ghost"
    href="/docs/kuki-logic-viewing-guide.pdf"
    download
  >
    <span className="label-pc">内覧会資料ダウンロード</span>
    <span className="label-sp">資料DL</span>
  </a>
  {/* 申込CTA（主役）。PC/SPでラベルをCSS切替 */}
  <a className="nav-cta" href="#viewing">
    <span className="label-pc">内覧会に申し込む →</span>
    <span className="label-sp">申し込む</span>
  </a>
</div>
```

- [ ] **Step 2: globals.cssにスタイル追加**

`.nav-cta:hover` ブロック（既存 454-458行付近）の直後に追加:

```css
/* ---------- ナビ右側のアクション群（資料DL + 申込CTA） ---------- */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 資料DLボタン: 申込CTA（オレンジ塗り）を主役に保つゴースト調 */
.nav-cta--ghost {
  color: var(--accent-2);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: none;
}

.nav.is-scrolled .nav-cta--ghost {
  background: transparent;
  box-shadow: none;
}

.nav-cta--ghost:hover {
  background: #ffffff;
  color: var(--accent-2);
  box-shadow: 0 4px 12px rgba(255, 122, 41, 0.2);
}

/* ラベルのPC/SP切替（既存ブレークポイント760pxに合わせる） */
.nav-cta .label-sp {
  display: none;
}

@media (max-width: 760px) {
  .nav-cta .label-pc {
    display: none;
  }
  .nav-cta .label-sp {
    display: inline;
  }
  .nav-cta {
    padding: 9px 14px;
    font-size: 12px;
  }
  .nav-actions {
    gap: 8px;
  }
}
```

- [ ] **Step 3: 表示・DL動作を検証**

Run: `npm run build && npm run lint`
Expected: 両方成功

`npm run dev` で確認（Playwrightまたは手動）:
1. PC幅（>760px）: ロゴ右側に「内覧会資料ダウンロード」（白地・オレンジ文字）→「内覧会に申し込む →」（オレンジ塗り）の順で並ぶ
2. スマホ幅（≤760px、例: 390px）: ラベルが「資料DL」「申し込む」になり、2ボタンとロゴが1行に収まって折り返さない
3. スクロール後（.is-scrolled状態）でも両ボタンの視認性が保たれる
4. DLボタンクリックでPDFがダウンロードされる（ブラウザ内表示にならない）

- [ ] **Step 4: コミット**

```bash
git add components/ScrollChrome.tsx app/globals.css
git commit -m "feat: ヘッダーに内覧会資料PDFのダウンロードボタンを追加"
```

---

## 最終確認（全タスク完了後）

- [ ] `npm run build` / `npm run lint` 成功
- [ ] `git log --oneline` でコミットが計画どおり分割されている
- [ ] pushはせず、ユーザーに完了報告（各サイクルの結果を一行ずつ）
