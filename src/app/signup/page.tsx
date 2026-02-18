"use client";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [display_name, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const email = `${loginId}@fukaken.local`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({ id: data.user.id, display_name });
      if (upsertError) {
        console.error(upsertError);
      }
    }

    router.push("/dashboard");
  };

  return (
    <div>
      <input
        placeholder="ログインID"
        onChange={(e) => setLoginId(e.target.value)}
      />
      <input
        placeholder="表示名"
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>登録</button>
    </div>
  );
}
