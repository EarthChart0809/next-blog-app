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
    <div className="mx-auto max-w-xl space-y-8 p-6 text-sm text-black">
      {/* ===== Task追加 ===== */}
      <section className="space-y-4 border border-gray-200 p-4">
        <h1 className="text-base font-semibold">Task追加</h1>

        <input
          className="w-full border border-gray-300 px-2 py-1.5 focus:border-black focus:outline-none"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="date"
          className="w-full border border-gray-300 px-2 py-1.5 focus:border-black focus:outline-none"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          className="w-full border border-gray-300 px-2 py-1.5 focus:border-black focus:outline-none"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
        >
          <option value="EVENT">イベント</option>
          <option value="CONTEST">大会</option>
        </select>

        <button
          onClick={submit}
          className="w-full border border-black bg-black py-1.5 text-white transition hover:bg-white hover:text-black"
        >
          追加
        </button>
      </section>

      {/* ===== Task管理 ===== */}
      <section className="space-y-3 border border-gray-200 p-4">
        <h1 className="text-base font-semibold">Task 管理</h1>

        {tasks.length === 0 ? (
          <p className="text-gray-500">Taskはまだありません</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between py-2"
              >
                <span>{task.title}</span>

                <div className="flex gap-2">
                  <Link href={`/admin/tasks/${task.id}`}>
                    <button className="border border-black px-2 py-0.5 text-xs hover:bg-black hover:text-white">
                      編集
                    </button>
                  </Link>

                  <button
                    onClick={async () => {
                      if (!confirm("削除しますか？")) return;

                      await fetch(`/api/admin/tasks/${task.id}`, {
                        method: "DELETE",
                      });

                      setTasks((prev) => prev.filter((t) => t.id !== task.id));
                    }}
                    className="border border-gray-300 px-2 py-0.5 text-xs text-red-600 hover:border-red-600"
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="w-[280px] space-y-3 border border-black p-4">
        <h2 className="text-sm font-semibold text-black">七セグ表示の基準日</h2>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 px-2 py-1.5 text-sm text-black focus:border-black focus:outline-none"
        />

        <p className="text-xs text-gray-500">
          カレンダー上部の残り日数表示に反映されます
        </p>
      </section>
    </div>
  );
}