"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

type PostApiResponse = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  // 追加: クライアント側でフィルター一致判定するためのフィールド
  categoryIds?: string[];
  published?: boolean;
};

type Category = { id: string; name: string };

const Page: React.FC = () => {
  const [posts, setPosts] = useState<PostApiResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  // 削除処理中の ID 管理（フールプルーフ）
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  // --- 追加: 検索・フィルター用 state とカテゴリ取得 ---
  const [titleQuery, setTitleQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [publishedFilter, setPublishedFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setCategories(data);
    } catch {
      // silent
    }
  };
  // --- 追加ここまで ---

  const fetchPosts = async (opts?: {
    title?: string;
    categoryId?: string | null;
    published?: "all" | "published" | "draft";
  }) => {
    try {
      setIsLoading(true);
      // クエリを付与して API に渡す（バックエンドが対応していればサーバー側で絞り込み）
      const params = new URLSearchParams();
      if (opts?.title) params.set("title", opts.title);
      if (opts?.categoryId) params.set("categoryId", opts.categoryId);
      if (opts?.published && opts.published !== "all") {
        params.set(
          "published",
          opts.published === "published" ? "true" : "false",
        );
      }
      const url = `/api/admin/posts${params.toString() ? `?${params.toString()}` : ""}`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status}`);
      let data = (await res.json()) as PostApiResponse[];

      // 優先度付きソート：タイトル一致 > カテゴリ一致 > 公開状態一致
      if (
        opts?.title ||
        opts?.categoryId ||
        (opts?.published && opts.published !== "all")
      ) {
        const q = opts?.title?.toLowerCase() ?? "";
        const expectedPublished =
          opts?.published && opts.published !== "all"
            ? opts.published === "published"
            : null;

        const score = (p: PostApiResponse) => {
          let s = 0;
          if (q) s += p.title.toLowerCase().includes(q) ? 100 : 0;
          if (opts?.categoryId)
            s += p.categoryIds?.includes(opts.categoryId) ? 10 : 0;
          if (expectedPublished !== null)
            s += p.published === expectedPublished ? 1 : 0;
          return s;
        };

        data = data.sort((a, b) => {
          const sa = score(a);
          const sb = score(b);
          if (sa !== sb) return sb - sa; // スコアが高いものを前に
          return (a.order ?? 0) - (b.order ?? 0);
        });
      }

      setPosts(data);
    } catch (e) {
      setFetchErrorMsg("投稿一覧の取得に失敗しました");
      setPosts(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この投稿を削除しますか？")) return;
    if (deletingIds.includes(id)) return; // 既に処理中なら無視
    setDeletingIds((s) => [...s, id]);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除に失敗しました");
      // 成功なら再取得
      await fetchPosts({
        title: titleQuery,
        categoryId,
        published: publishedFilter,
      });
    } catch (e) {
      alert("削除に失敗しました。再試行してください。");
      await fetchPosts({
        title: titleQuery,
        categoryId,
        published: publishedFilter,
      });
    } finally {
      setDeletingIds((s) => s.filter((x) => x !== id));
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggingId(id);
  };

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    setDraggingId(null);
    setDragOverId(null);
    if (!posts) return;
    if (!draggedId || draggedId === targetId) return;

    const newPosts = [...posts];
    const draggedIndex = newPosts.findIndex((p) => p.id === draggedId);
    const targetIndex = newPosts.findIndex((p) => p.id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const [moved] = newPosts.splice(draggedIndex, 1);
    newPosts.splice(targetIndex, 0, moved);

    // 再付番（orderフィールドを更新）
    const reindexed = newPosts.map((p, idx) => ({ ...p, order: idx }));

    setPosts(reindexed);

    try {
      await fetch("/api/admin/posts/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reindexed.map((p) => p.id) }),
      });
    } catch {
      // 失敗したら再取得
      await fetchPosts({ title: titleQuery, categoryId });
    }
  };

  useEffect(() => {
    // 初期取得
    fetchCategories();
    fetchPosts();
  }, []);

  // 検索フォーム送信
  const onSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await fetchPosts({
      title: titleQuery,
      categoryId,
      published: publishedFilter,
    });
    // 検索結果を画面上部に持ってくる（スクロール）
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!posts) return <div className="text-red-500">{fetchErrorMsg}</div>;

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">投稿記事一覧</div>

      {/* 追加: 検索・フィルター */}
      <form
        onSubmit={onSearch}
        className="mb-4 flex flex-wrap items-center gap-2 sm:flex-nowrap"
      >
        <input
          type="text"
          placeholder="タイトルで検索"
          value={titleQuery}
          onChange={(e) => setTitleQuery(e.target.value)}
          className="w-full rounded border p-2 sm:w-72"
        />
        <select
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(e.target.value || null)}
          className="w-full rounded border p-2 sm:w-auto"
        >
          <option value="">すべてのカテゴリ</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* 公開 / 下書き フィルター */}
        <select
          value={publishedFilter}
          onChange={(e) =>
            setPublishedFilter(e.target.value as "all" | "published" | "draft")
          }
          className="w-full rounded border p-2 sm:w-auto"
        >
          <option value="all">公開状態: すべて</option>
          <option value="published">公開のみ</option>
          <option value="draft">下書きのみ</option>
        </select>

        <button
          type="submit"
          className={twMerge(
            "w-full rounded-md px-4 py-1 font-bold sm:w-auto",
            "bg-indigo-500 text-white hover:bg-indigo-600",
          )}
        >
          検索
        </button>
        <button
          type="button"
          onClick={() => {
            setTitleQuery("");
            setCategoryId(null);
            setPublishedFilter("all");
            fetchPosts();
            if (typeof window !== "undefined")
              window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={twMerge(
            "w-full rounded-md px-4 py-1 font-bold sm:w-auto",
            "bg-gray-200 text-gray-800 hover:bg-gray-300",
          )}
        >
          クリア
        </button>
      </form>

      {/* モバイル用カード表示（sm未満） */}
      <div className="space-y-3 sm:hidden">
        {posts.map((p) => (
          <div
            key={p.id}
            className={twMerge(
              "rounded border bg-white p-3",
              dragOverId === p.id ? "bg-gray-50" : "",
            )}
            draggable
            onDragStart={(e) => handleDragStart(e, p.id)}
            onDragEnter={(e) => handleDragEnter(e, p.id)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, p.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold">{p.title}</div>
                <div className="text-xs text-gray-500">
                  作成: {p.createdAt} / 更新: {p.updatedAt}
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={`/admin/posts/${p.id}`}>
                <button
                  type="button"
                  className={twMerge(
                    "rounded-md px-4 py-1 font-bold",
                    "bg-indigo-500 text-white hover:bg-indigo-600",
                  )}
                >
                  編集
                </button>
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                disabled={deletingIds.includes(p.id)}
                className={twMerge(
                  "rounded-md px-4 py-1 font-bold",
                  "bg-red-500 text-white hover:bg-red-600",
                  deletingIds.includes(p.id)
                    ? "cursor-not-allowed opacity-50 hover:bg-red-500"
                    : "",
                )}
              >
                {deletingIds.includes(p.id) ? "削除中..." : "削除"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* デスクトップ/タブレット：テーブル表示（sm以上） */}
      <div className="hidden sm:block">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">タイトル</th>
              <th className="border p-2">作成日</th>
              <th className="border p-2">更新日</th>
              <th className="border p-2">編集</th>
              <th className="border p-2">削除</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStart(e, p.id)}
                onDragEnter={(e) => handleDragEnter(e, p.id)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, p.id)}
                className={twMerge(
                  "border",
                  dragOverId === p.id ? "bg-gray-100" : "",
                  draggingId === p.id ? "opacity-70" : "",
                )}
                style={{ cursor: "grab" }}
              >
                <td className="p-2">{p.title}</td>
                <td className="p-2 text-sm">{p.createdAt}</td>
                <td className="p-2 text-sm">{p.updatedAt}</td>
                <td className="p-2 text-center">
                  <Link href={`/admin/posts/${p.id}`}>
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
                </td>
                <td className="p-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingIds.includes(p.id)}
                    className={twMerge(
                      "rounded-md px-5 py-1 font-bold",
                      "bg-red-500 text-white hover:bg-red-600",
                      deletingIds.includes(p.id)
                        ? "cursor-not-allowed opacity-50 hover:bg-red-500"
                        : "",
                    )}
                  >
                    {deletingIds.includes(p.id) ? "削除中..." : "削除"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Page;
