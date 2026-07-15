# 設計書: TypeScript移行 + 内覧会資料PDFダウンロードボタン

日付: 2026-07-16
対象リポジトリ: logic-kuki（久喜LOGIC LP / Next.js 16 / Vercel）

## 目的

1. プロジェクト全体（15ファイル・約1,030行）をJavaScriptからTypeScriptへ移行する
2. ヘッダーの「内覧会に申し込む →」ボタンの左に、内覧会資料PDFのダウンロードボタンを追加する

作業順序は **TS移行 → PDFボタン実装**。PDFボタンの新規コードを最初からTypeScriptで書くため。

## 前提・決定事項

- PDFのダウンロードは **誰でも可**（認証・フォームゲートなし）。ただし配信自体は安全に行う
- 配信方式は **案A: public配置 + セキュリティヘッダー** を採用
  - 案B（API route配信）: 誰でもDL可なら実質メリットなし、CDNキャッシュが効きにくいため不採用
  - 案C（Vercel Blob等外部ストレージ）: 依存・設定が増える。資料更新が頻繁になったら再検討
- 元PDF: `~/Desktop/久喜LOGIC内覧会資料_20260714.pdf`（約4MB）

## パート1: TypeScript移行

### 変更内容

- devDependencies追加: `typescript` `@types/react` `@types/react-dom` `@types/node`
- `jsconfig.json` を削除し `tsconfig.json` を作成（`strict: true`）
- 全15ファイルを `.js` → `.tsx` にリネームして型付け
  - `app/layout.js` `app/page.js`
  - `components/` 配下12ファイル + `components/demo/WarehouseDots.js`
- 関数にJSDocを付与
- `any` は使わず `unknown` を使用

### 制約

- **挙動は一切変えない**。型付けとリネームのみ。ロジックのリファクタ禁止
- 難所: `Hero`（232行、ref/timer）、`WarehouseDots`（248行、three.js / react-three-fiber型）、`BackgroundScene`、`ScrollChrome`（ref操作）

### コミット分割

1. TS環境設定（deps + tsconfig）
2. 単純コンポーネント群のリネーム・型付け
3. 難所ファイル（必要に応じてファイル単位で分割）

## パート2: PDFダウンロードボタン

### PDF配置

- 配置先: `public/docs/kuki-logic-viewing-guide.pdf`（URLはASCII名。日本語URLはエンコード問題の元）
- 配置前にPDFメタデータ（作成者名等の意図しない情報）を確認し、あれば除去して報告する

### セキュリティヘッダー（next.config.mjs の headers()）

`/docs/:path*` に対して:

| ヘッダー | 値 | 目的 |
|---|---|---|
| Content-Disposition | `attachment; filename*=UTF-8''久喜LOGIC内覧会資料.pdf` | ブラウザ内表示させず確実にDL。保存名は日本語指定 |
| X-Content-Type-Options | `nosniff` | MIMEスニッフィング防止 |
| Cache-Control | `public, max-age=3600` | 差し替え時に古いファイルが残りすぎない |

### ボタンUI（components/ScrollChrome.tsx）

- 「内覧会に申し込む →」の**左**にDLボタンを追加
- DLボタンはセカンダリスタイル（例: `.nav-cta--ghost`）。申込CTAが主役のまま
- `<a href="/docs/kuki-logic-viewing-guide.pdf" download>` 形式
- ラベルはCSSメディアクエリ（既存基準の `max-width: 760px`）で切替:

| 幅 | DLボタン | 申込ボタン |
|---|---|---|
| PC（>760px） | 内覧会資料ダウンロード | 内覧会に申し込む → |
| スマホ（≤760px） | 資料DL | 申し込む |

- 実装方式: PC用・SP用の `<span>` をメディアクエリで表示切替（`app/globals.css` にスタイル追加）

### コミット分割

1. PDF配置 + next.config.mjsヘッダー設定
2. ボタンUI追加（ScrollChrome.tsx + globals.css）

## 検証・終了条件

- `npm run build` と `npm run lint` が通ること（コミット前に必ずlint）
- `npm run dev` でPC幅・スマホ幅（760px境界）の表示確認
- DLボタンクリックでPDFがダウンロードされること
- 修正試行は最大5回。解決しなければ状況を報告して停止
- push は行わない（ユーザー確認後）

## スコープ外

- フォームゲート・アクセス制御・DL数計測
- 既存ロジックのリファクタリング
- README等ドキュメントの変更
