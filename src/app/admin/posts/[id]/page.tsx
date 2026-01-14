"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

type Category = { id: string; name: string };

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageURL, setCoverImageURL] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [published, setPublished] = useState(false); // 追加

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/posts/${id}`);
      const post = await res.json();

      setTitle(post.title);
      setContent(post.content);
      setCoverImageURL(post.coverImageURL);
      setChecked(post.categories.map((c: Category) => c.id));
      setPublished(Boolean(post.published));

      const c = await fetch("/api/categories").then((r) => r.json());
      setCategories(c);
      setLoading(false);
    })();
  }, [id]);

  const save = async () => {
    await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        coverImageURL,
        categoryIds: checked,
        published,
      }),
    });
    alert("保存しました");
  };

  const remove = async () => {
    if (!confirm("削除しますか？")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    router.push("/admin/posts");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="h-60 w-full border p-2"
      />
      <input
        value={coverImageURL}
        onChange={(e) => setCoverImageURL(e.target.value)}
        className="w-full border p-2"
      />

      <div className="flex flex-wrap gap-3">
        {categories.map((c) => (
          <label key={c.id}>
            <input
              type="checkbox"
              checked={checked.includes(c.id)}
              onChange={() =>
                setChecked(
                  checked.includes(c.id)
                    ? checked.filter((x) => x !== c.id)
                    : [...checked, c.id],
                )
              }
            />
            {c.name}
          </label>
        ))}
      </div>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        公開する
      </label>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={save}
          className={twMerge(
            "rounded-md px-5 py-1 font-bold",
            "bg-indigo-500 text-white hover:bg-indigo-600",
          )}
        >
          保存
        </button>
        <button
          type="button"
          onClick={remove}
          className={twMerge(
            "rounded-md px-5 py-1 font-bold",
            "bg-red-500 text-white hover:bg-red-600",
          )}
        >
          削除
        </button>
      </div>
    </div>
  );
}
