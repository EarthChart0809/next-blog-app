"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-lg font-semibold text-black">管理者用機能</h1>

      <ul className="space-y-2">
        {[
          { href: "/admin/posts", label: "投稿一覧" },
          { href: "/admin/posts/new", label: "新規投稿作成" },
          { href: "/admin/categories", label: "カテゴリ管理" },
          { href: "/admin/categories/new", label: "カテゴリ追加" },
          { href: "/admin/tasks", label: "タスク管理" },
        ].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between rounded border border-black px-4 py-2 text-sm text-black transition hover:bg-black hover:text-white"
            >
              <span>{item.label}</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Page;
