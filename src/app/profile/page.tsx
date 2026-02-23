"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { ROLE_LABEL } from "@/lib/member_role";

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const updateProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, member_role: role })
      .eq("id", user.id);

    if (error) {
      setMessage("更新失敗");
    } else {
      setMessage("更新しました！");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-[320px] border border-gray-200 p-5 shadow-sm">
        <h1 className="mb-5 text-center text-lg font-medium text-black">
          プロフィール編集
        </h1>

        {/* 表示名 */}
        <label className="mb-1 block text-xs text-gray-600">表示名</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="表示名"
          className="mb-4 w-full border border-gray-300 px-2 py-1.5 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none"
        />

        {/* 班 */}
        <label className="mb-1 block text-xs text-gray-600">所属班</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mb-5 w-full border border-gray-300 bg-white px-2 py-1.5 text-sm text-black focus:border-black focus:outline-none"
        >
          <option value="">未選択</option>
          <option value="mechanism">機構班</option>
          <option value="program">プログラム班</option>
          <option value="circuit">回路班</option>
          <option value="executive">重役</option>
        </select>

        {/* 更新ボタン */}
        <button
          onClick={updateProfile}
          className="w-full border border-black bg-black py-1.5 text-sm text-white transition hover:bg-white hover:text-black"
        >
          更新
        </button>

        {/* メッセージ */}
        {message && (
          <p className="mt-3 text-center text-xs text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}
