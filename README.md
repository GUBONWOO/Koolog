# KOOLOG

日常や勉強の記録を日本語で残したくて自作した個人ブログです。

---

## 技術スタック

| 区分 | 技術 |
|------|------|
| Runtime | Node.js 20 |
| Language | TypeScript |
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Markdown | react-markdown, remark-gfm |
| Database | PostgreSQL 16 |
| ORM | pg (node-postgres) |
| Infra | Docker, Docker Compose |

---

## 主な機能

- Markdownで記事を作成（GFM対応 — コードブロック・表・リンクなど完全サポート）
- 画像・動画のアップロード（ファイル選択 / URLから取得 / クリップボード貼り付け / ドラッグ＆ドロップ）
- YouTube URLからサムネイルを自動でカバー画像に設定
- カテゴリ別分類（料理・勉強・雑記・秘密フォルダ）
- 外部からは閲覧のみ許可 — 投稿・編集・削除は内部ネットワーク限定

---

## フロントエンド構成

```
src/
├── app/
│   ├── page.tsx                 # ホーム（記事一覧・カテゴリフィルター・検索）
│   ├── blog/[slug]/
│   │   ├── page.tsx             # 記事詳細（react-markdownでレンダリング）
│   │   ├── edit/page.tsx        # 記事編集
│   │   └── PostActions.tsx      # 編集・削除ボタン
│   ├── write/page.tsx           # 記事作成
│   └── about/page.tsx           # 自己紹介ページ
└── components/
    ├── HomeContent.tsx          # 記事一覧・カテゴリタブ・検索
    ├── FeaturedPost.tsx         # 最新記事の大型カード
    ├── PostCard.tsx             # 記事一覧カード
    ├── Navbar.tsx               # ナビゲーション
    └── Footer.tsx               # フッター
```

Next.js App Routerを使用し、記事詳細ページはサーバーコンポーネントでDBを直接参照します。
APIコールなしでレンダリングされるためSEOに有利で、初期表示も高速です。
作成・編集ページはクライアントコンポーネントとし、エディターの状態管理やファイルアップロードのUXを処理しています。

---

## バックエンド構成

```
src/
├── middleware.ts                # IPによるアクセス制御（外部は閲覧のみ）
├── app/api/
│   ├── posts/
│   │   ├── route.ts             # GET 一覧取得（カテゴリ・検索フィルター）、POST 記事作成
│   │   └── [slug]/route.ts      # GET 単件取得、PUT 編集、DELETE 削除
│   ├── upload/
│   │   ├── route.ts             # ファイルアップロード（画像10MB / 動画200MB）
│   │   └── from-url/route.ts    # URLから画像取得
│   └── secret-verify/route.ts   # 削除前のPIN確認
└── lib/
    ├── db.ts                    # PostgreSQL接続・テーブル初期化
    └── posts.ts                 # DB CRUD
```

画像の挿入はファイルアップロード・URL取得・クリップボード貼り付け・ドラッグ＆ドロップの4種類に対応しています。
URL取得時はmagic bytesで実際の画像ファイルかどうかを検証し、不正なファイルのアップロードを防いでいます。

---

## サーバー・インフラ構成

```
Docker Compose
├── postgres   PostgreSQL 16（データ永続ボリューム）
└── koolog     Node.js 20 + Next.jsビルドイメージ（ポート8082）
               アップロードファイル永続ボリュームマウント
```

Next.js MiddlewareでIPを判定し、外部からは閲覧のみ許可、
投稿・編集・削除は内部ネットワークからのみ操作できるようアクセスを制御しています。

| エンドポイント | 外部IP | 内部IP |
|------|:-------:|:-------:|
| GET /api/posts（閲覧） | ✅ | ✅ |
| POST · PUT · DELETE /api/posts | ❌ | ✅ |
| /api/upload | ❌ | ✅ |
| /write, /blog/\*/edit | ❌ ホームへリダイレクト | ✅ |
