import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: Props) {
  const supabase = await createSupabaseServerClient();

  // セッション取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未ログイン
  if (!user) {
    redirect("/login");
  }

  // プロフィール取得
  const { data: profile } = await supabase
    .from("profiles")
    .select("member_role")
    .eq("id", user.id)
    .single();

  // 重役以外は弾く
  if (!["executive", "mechanism", "program", "circuit"].includes(profile?.member_role || "")) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
