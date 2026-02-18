"use client";

import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const email = `${loginId}@fukaken.local`;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("ログイン失敗");
    }
  };

  return (
    <div>
      <input
        placeholder="ログインID"
        onChange={(e) => setLoginId(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>ログイン</button>
    </div>
  );
}
