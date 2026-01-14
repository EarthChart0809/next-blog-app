"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

type Category = {
  id: string;
  name: string;
  postCount?: number;
};

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories", { cache: "no-store" });
    const cats = await res.json();

    // 管理用 posts API からカテゴリごとの使用数を算出（admin/posts が categoryIds を返す前提）
    const counts: Record<string, number> = {};
    try {
      const postsRes = await fetch("/api/admin/posts", { cache: "no-store" });
      if (postsRes.ok) {
        const posts = await postsRes.json();
        (posts as any[]).forEach((p) => {
          const ids: string[] =
            p.categoryIds ??
            (Array.isArray(p.categories)
              ? p.categories.map((c: any) => c.id)
              : []);
          ids.forEach((cid) => {
            counts[cid] = (counts[cid] || 0) + 1;
          });
        });
      }
    } catch {
      // silent
    }

    setCategories(
      (cats as Category[]).map((c) => ({ ...c, postCount: counts[c.id] ?? 0 })),
    );
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("削除しますか？")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">カテゴリ管理</h1>
      </div>

      <div className="flex justify-end">
        <Link href="/admin/categories/new">
          <button
            type="button"
            className={twMerge(
              "rounded-md px-4 py-2 font-bold",
              "bg-green-500 text-white hover:bg-green-600",
            )}
          >
            新規作成
          </button>
        </Link>
      </div>

      {categories.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between rounded border p-2"
        >
          <Link href={`/admin/categories/${c.id}`} className="font-bold">
            {c.name}
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{c.postCount ?? 0} 件</span>

            <Link href={`/admin/categories/${c.id}`}>
              <button
                type="button"
                className={twMerge(
                  "rounded-md px-5 py-1 font-bold",
                  "bg-indigo-500 text-white hover:bg-indigo-600",
                )}
              >
                編集
              </button>
            </Link>
            <button
              type="button"
              onClick={() => deleteCategory(c.id)}
              className={twMerge(
                "rounded-md px-5 py-1 font-bold",
                "bg-red-500 text-white hover:bg-red-600",
              )}
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}
