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
};

const Page: React.FC = () => {
  const [posts, setPosts] = useState<PostApiResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/posts", { cache: "no-store" });
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
              <tr key={p.id}>
                <td className="border p-2">{p.title}</td>
                <td className="border p-2 text-sm">{p.createdAt}</td>
                <td className="border p-2 text-sm">{p.updatedAt}</td>
                <td className="border p-2 text-center">
                  <Link
                    href={`/admin/posts/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    編集
                  </Link>
                </td>
                <td className="border p-2 text-center">
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
