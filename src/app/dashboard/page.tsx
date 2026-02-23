"use client";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { ROLE_LABEL } from "@/lib/member_role";
import Link from "next/link";

export default function Dashboard() {
  const [displayName, setDisplayName] = useState("");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, member_role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setDisplayName(data?.display_name ?? "");
      setProfile(data);
    };

    load();
  }, []);

  return (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-[320px] border border-gray-200 p-5 shadow-sm">
      {/* 見出し */}
      <h1 className="mb-4 text-center text-lg font-medium text-black">
        ダッシュボード
      </h1>

      {/* ようこそ */}
      <div className="mb-3 text-sm text-black">
        ようこそ{" "}
        <span className="font-medium">
          {displayName || "ゲスト"}
        </span>{" "}
        さん
      </div>

      {/* 班表示 */}
      <p className="mb-6 text-sm text-gray-700">
        班：
        <span className="ml-1 text-black">
          {profile?.member_role
            ? ROLE_LABEL[profile.member_role]
            : "未所属"}
        </span>
      </p>

      {/* アクション */}
      <div className="space-y-2">
        <a
          href="/profile"
          className="block w-full border border-black bg-black py-1.5 text-center text-sm text-white
                     transition hover:bg-white hover:text-black"
        >
          プロフィール編集
        </a>

        <Link
          href="/groups"
          className="block w-full border border-gray-300 py-1.5 text-center text-sm text-black
                     transition hover:border-black"
        >
          班メンバー一覧
        </Link>
      </div>
    </div>
  </div>
);
}
