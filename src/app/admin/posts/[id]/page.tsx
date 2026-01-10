"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/posts/${id}`);
      const post = await res.json();

      setTitle(post.title);
      setContent(post.content);
      setCoverImageURL(post.coverImageURL);
      setChecked(post.categories.map((c: Category) => c.id));

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

      <div className="flex gap-4">
        <button onClick={save} className="bg-indigo-500 px-4 py-2 text-white">
          保存
        </button>
        <button onClick={remove} className="bg-red-500 px-4 py-2 text-white">
          削除
        </button>
      </div>
    </div>
  );
}
