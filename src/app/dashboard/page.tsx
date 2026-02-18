"use client";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { ROLE_LABEL } from "@/lib/role";

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
        .select("display_name, role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setDisplayName(data?.display_name ?? "");
    };

    load();
  }, []);

  return (
    <div>
  <div>ようこそ {displayName || "ゲスト"} さん</div>
    <p>
  班：
  {profile?.role
    ? ROLE_LABEL[profile.role]
    : "未所属"}
      </p>
      </div>
  );
}
