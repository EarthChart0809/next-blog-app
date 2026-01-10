"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
};

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories", { cache: "no-store" });
    setCategories(await res.json());
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
      <h1 className="text-2xl font-bold">カテゴリ管理</h1>

      {categories.map((c) => (
        <div key={c.id} className="flex justify-between border p-2 rounded">
          <Link href={`/admin/categories/${c.id}`} className="font-bold">
            {c.name}
          </Link>
          <button
            onClick={() => deleteCategory(c.id)}
            className="text-red-500 text-sm"
          >
            削除
          </button>
        </div>
      ))}
    </main>
  );
}
