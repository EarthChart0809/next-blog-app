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
};

const Page: React.FC = () => {
  const [posts, setPosts] = useState<PostApiResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      // 管理画面は全件取得するため admin API を呼ぶ
      const res = await fetch("/api/admin/posts", { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = (await res.json()) as PostApiResponse[];
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
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    await fetchPosts();
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
      await fetchPosts();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

      {posts.length === 0 ? (
        <div className="text-gray-500">投稿がありません</div>
      ) : (
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
                  <Link
                    href={`/admin/posts/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    編集
                  </Link>
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default Page;
