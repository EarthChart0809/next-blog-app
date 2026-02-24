# Fukaken — 部活動 内部運営ツール (NextBlogApp)

## 概要
Fukaken は、**部活動の内部運営を支援するための Web アプリケーション**です。  
メンバー管理（班別一覧）、プロフィール、予定カレンダー、タスク管理（管理者用 UI）などを備え、  
部員間の情報共有と運営状況の「見える化」を目的としています。

- **想定利用者**
  - 一般部員：プロフィール閲覧・編集、カレンダー確認
  - 役員・管理者：タスク管理、管理画面の利用

> 内部向けツールとして設計されており、学内・部内利用を前提としています。

---

## 開発背景・経緯

部活動では、連絡事項・予定・役割管理が  チャット・口頭・個人メモなどに分散しやすく、作業の抜けや重複が発生していました。

これらを **1つの Web アプリに集約し、全員が同じ情報を同じ状態で確認できる環境** を作るため、個人開発として本プロジェクトを立ち上げました。

認証・権限管理を含む学内運用の制約に対応するため、  
Supabase を用いて迅速にプロトタイプを構築し、段階的に機能拡張を行っています。

## 公開 URL
https://next-blog-app-fukaken.vercel.app/

## 特徴と機能

### ユーザー認証・プロフィール
- メールベース（学内ローカル定義）でのサインアップ／ログイン
- プロフィールに表示名・所属班（`member_role`）を保持

![ホーム画面](/public/images/home.png)

### 班一覧（Groups）
- `ROLE_LABEL` に基づく班一覧表示

![班一覧](/public/images/group.png)
- 班ごとのメンバー一覧を確認可能

![班一覧](/public/images/group_details.png)

### カレンダー・タスク管理（七セグ表示）
- 大会・イベントの日程を登録・表示
- 次回大会までの残り日数を 七セグ風 UI で可視化
- 管理者はタスクの追加・編集・削除が可能（`/admin`）

![カレンダー](/public/images/calendar.png)
![タスク](/public/images/editor_task.png)

### 権限管理（Admin Guard）
- Supabase RLS とサーバー側認証を組み合わせたアクセス制御
- 未認証時はサーバー側でリダイレクト
- クライアント側では認証状態の読み込み完了待ちを実装

![管理](/public/images/editor.png)
![管理](/public/images/manegement.png)

---

## 使用技術（技術スタック）

- 言語 / フレームワーク
  - TypeScript、Next.js (App Router)
  - React（Server / Client コンポーネント混在）
- バックエンド / DB
  - Prisma（SQLite / PostgreSQL 等）、Supabase (Auth + RLS + Storage)
- UI / ライブラリ
  - Tailwind CSS、FontAwesome、dayjs、DOMPurify
- ツール / ホスティング
  - VSCode、pnpm/npm、Vercel、Supabase コンソール

## システム構成図

![管理](/public/images/structure_short.png)

## ローカル実行手順

1. リポジトリをクローン
   npm install
2. 環境変数を設定（.env）
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY（必要に応じて）
   - DATABASE_URL（Prisma 用）
   - NEXT_PUBLIC_BASE_URL（任意）
3. Prisma マイグレーション / 生成（DB を使用する場合）
   npx prisma migrate dev
   npx prisma generate
4. 開発サーバー起動
   npm run dev
5. Supabase のコンソールで RLS ポリシーや profiles テーブルを確認

## 開発期間・体制
- 開発体制：個人開発
- 開発期間：2026.01.20 〜 2026.02.23（約 50 時間）

## 工夫した点・苦労した点

- Next.js の Server / Client コンポーネント混在環境での認証設計（createServerClient を用いたサーバー側認証と、クライアント側 useAuth/isLoading 待ちの両立）。
- Supabase の RLS に対応するため、管理操作は service_role キーを使ったサーバー API 経由にする等の設計を採用。
- 七セグ表示やカレンダー連携など、視覚的に情報を分かりやすく提示する UI を実装。
- Supabase Auth と Next.js App Router を組み合わせた認証設計において、
サインアップ直後のセッション未確定状態や RLS 制約を考慮した安全なプロフィール生成フローを構築した。

## 既知の課題と今後の展望

- 既知の課題
  - 一部クライアントとサーバーで認証判定のズレが起きるケースがある（useAuth / AdminLayout の整備で改善）。
- 今後の展望
  - 管理者向けに操作ログ、通知・メール送信機能の追加
  - モバイル UX 改善、アクセシビリティ向上


## 連絡先（任意）

https://earthchart0809.github.io/Portfolio/
