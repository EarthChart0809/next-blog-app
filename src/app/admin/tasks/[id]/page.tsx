"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TaskEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [type, setType] = useState("MEETING");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/tasks/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Task not found");
        }
        return res.json();
      })
      .then((task) => {
        setTitle(task.title);
        setStartAt(task.startAt.slice(0, 16));
        setType(task.type);
      })
      .catch((err) => {
        console.error(err);
        alert("タスクの取得に失敗しました");
        router.push("/admin/tasks");
      });
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`/api/admin/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        startAt,
        type,
      }),
    });

    router.push("/admin/tasks");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Task 編集</h1>

      <input value={title} onChange={(e) => setTitle(e.target.value)} />

      <input
        type="datetime-local"
        value={startAt}
        onChange={(e) => setStartAt(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="MEETING">会議</option>
        <option value="EVENT">大会</option>
      </select>

      <button type="submit">保存</button>
    </form>
  );
}
