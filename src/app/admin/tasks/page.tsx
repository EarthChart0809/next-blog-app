"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchTasks } from "@/lib/tasks/fetchTasks";
import { Task } from "@/app/_types/task";

export default function TaskAdminPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"CONTEST" | "EVENT">("EVENT");

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks()
      .then((ts) => setTasks(ts))
      .catch((err) => console.error("fetchTasks error:", err));
  }, []);

  async function submit() {
    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title, date, type }),
      headers: { "Content-Type": "application/json" },
    });

    // 再取得して一覧を更新
    try {
      const latest = await fetchTasks();
      setTasks(latest);
    } catch (err) {
      console.error(err);
    }

    alert("追加しました");
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-bold">Task追加</h1>

      <input
        className="border p-2"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="date"
        className="border p-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select
        className="border p-2"
        value={type}
        onChange={(e) => setType(e.target.value as any)}
      >
        <option value="EVENT">イベント</option>
        <option value="CONTEST">大会</option>
      </select>

      <button
        onClick={submit}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        追加
      </button>
      <div>
        <h1>Task 管理</h1>

        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.title}

              <Link href={`/admin/tasks/${task.id}`}>
                <button>編集</button>
              </Link>

              <button
                onClick={async () => {
                  if (!confirm("削除しますか？")) return;

                  await fetch(`/api/admin/tasks/${task.id}`, {
                    method: "DELETE",
                  });

                  // ローカル state を更新してリロードを避ける
                  setTasks((prev) => prev.filter((t) => t.id !== task.id));
                }}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
