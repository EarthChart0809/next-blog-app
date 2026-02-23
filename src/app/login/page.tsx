"use client";

import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const email = `${loginId}@fukaken.local`;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert("ログイン失敗");
      return;
    }

    // 成功したらダッシュボードへ遷移
    router.push("/admin");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-[280px] border border-gray-200 p-5 shadow-sm">
        <h1 className="mb-4 text-center text-lg font-medium text-black">
          Login
        </h1>

        <input
          className="mb-3 w-full border border-gray-300 px-2 py-1.5 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none"
          placeholder="ログインID"
          onChange={(e) => setLoginId(e.target.value)}
        />

        <input
          type="password"
          className="mb-4 w-full border border-gray-300 px-2 py-1.5 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none"
          placeholder="パスワード"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full border border-black bg-black py-1.5 text-sm text-white transition hover:bg-white hover:text-black disabled:opacity-50"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </div>
    </div>
  );
}
