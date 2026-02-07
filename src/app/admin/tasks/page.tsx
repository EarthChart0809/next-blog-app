"use client";

import { useState } from "react";

export default function TaskAdminPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"CONTEST" | "EVENT">("EVENT");

  async function submit() {
    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title, date, type }),
    });

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
    </div>
  );
}
