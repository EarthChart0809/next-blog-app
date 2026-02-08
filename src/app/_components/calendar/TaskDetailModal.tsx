"use client";

import type { CalendarEvent } from "@/app/_types/calendar";

type Props = {
  task: CalendarEvent | null;
  onClose: () => void;
};

export default function TaskDetailModal({ task, onClose }: Props) {
  if (!task) return null;

  return (
    // 👇 背景（ここをクリックすると閉じる）
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      {/* 👇 モーダル本体（クリック伝播を止める） */}
      <div
        className="w-96 rounded-lg bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">{task.title}</h2>

        <p className="mt-2 text-sm">
          種類：
          {task.type === "meeting"
            ? "会議"
            : task.type === "contest"
              ? "大会"
              : "カスタム"}
        </p>

        <p className="text-sm">日時：{new Date(task.date).toLocaleString()}</p>

        <div className="mt-4 flex justify-end">
          <button className="rounded bg-gray-200 px-3 py-1" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
