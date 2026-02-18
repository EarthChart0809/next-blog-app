"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { ROLE_LABEL } from "@/lib/role";

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
      .update({ display_name: displayName, role })
      .eq("id", user.id);

    if (error) {
      setMessage("更新失敗");
    } else {
      setMessage("更新しました！");
    }
  };

  return (
    <div>
      <h1>プロフィール編集</h1>

      <input
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="表示名"
      />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">未選択</option>
        <option value="mechanism">機構班</option>
        <option value="program">プログラム班</option>
        <option value="circuit">回路班</option>
        <option value="executive">重役</option>
      </select>

      <button onClick={updateProfile}>更新</button>

      {message && <p>{message}</p>}
    </div>
  );
}
