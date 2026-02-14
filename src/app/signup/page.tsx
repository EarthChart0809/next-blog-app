"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { usernameToEmail } from "@/lib/auth/usernameEmail";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const email = usernameToEmail(username);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/login");
  };

  return (
    <main className="mx-auto max-w-sm py-16">
      <h1 className="mb-6 text-center text-xl font-bold">新規登録</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border px-3 py-2"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button className="w-full border py-2">登録</button>
      </form>
    </main>
  );
}
