"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

const Page: React.FC = () => {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 text-black">
      {/* タイトル */}
      <h1 className="mb-6 text-2xl font-bold tracking-tight">About</h1>

      {/* アイコン */}
      <div className="mb-6 flex justify-center">
        <Image
          src="/images/icon-ume_suibokuga.png"
          alt="Profile Icon"
          width={220}
          height={220}
          priority
          className="rounded-full border border-black p-1"
        />
      </div>

      {/* 導入 */}
      <div className="space-y-3 text-sm leading-relaxed">
        <p>
          2025年部長の EarthChart0809 です。
          部活動の運営を効率化し、メンバー全員が活動に集中できる環境を作るためにこのサイトを開発しました。
        </p>
        <p>
          このサイトは、部活動の運営と日々の活動を支えるための内部向け Web サイトです。
          メンバー管理、予定の共有、タスク管理などを一元化し、
          部内の情報を「見える化」することを目的としています。
        </p>
      </div>

      {/* セクション：課題 */}
      <section className="mt-8">
        <h2 className="mb-2 text-base font-semibold">何を解決するか</h2>
        <p className="text-sm leading-relaxed">
          部活動では、誰がどの班に所属しているのか、
          次の大会・イベントまであと何日なのか、
          どの作業が残っているのかといった情報が分散しがちです。
          本サイトはそれらを Web 上に集約し、
          誰でも同じ情報を同じ状態で確認できる環境を提供します。
        </p>
      </section>

      {/* セクション：特徴 */}
      <section className="mt-8">
        <h2 className="mb-3 text-base font-semibold">主な特徴</h2>
        <ul className="space-y-2 border-l border-black pl-4 text-sm">
          <li>
            <span className="font-medium">ユーザー認証・権限管理</span><br />
            サインアップ・ログイン機能と役職に応じたアクセス制御
          </li>
          <li>
            <span className="font-medium">プロフィール・班管理</span><br />
            表示名や所属班の管理、班ごとのメンバー一覧表示
          </li>
          <li>
            <span className="font-medium">カレンダー・タスク管理</span><br />
            大会・イベントの日程管理と、七セグ表示による残り日数の可視化
          </li>
          <li>
            <span className="font-medium">管理者画面</span><br />
            タスクの追加・編集・削除など運営向け機能
          </li>
        </ul>
      </section>

      {/* コンセプト */}
      <section className="mt-8">
        <h2 className="mb-2 text-base font-semibold">コンセプト</h2>
        <p className="text-sm leading-relaxed">
          <strong>「部活動を“回す”ための道具」</strong>をコンセプトに、
          必要な情報がすぐ分かり、誰でも迷わず継続して使える
          シンプルな UI を目指しています。
        </p>
      </section>

      {/* 注記 */}
      <p className="mt-10 border-t pt-4 text-xs text-gray-500">
        ※ 内部向けツールのため、利用は部内メンバーに限定してください。
      </p>
    </main>
  );
};

export default Page;
