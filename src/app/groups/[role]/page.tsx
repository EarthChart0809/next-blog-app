import { supabase } from "@/lib/supabase/client";
import { ROLE_LABEL } from "@/lib/role";
import { notFound } from "next/navigation";

type Props = {
  params: { role: string } | Promise<{ role: string }>;
};

export default async function GroupDetailPage({ params }: Props) {
  const { role } = (await params) as { role: string }; // ← ここを変更

  const roleInfo = Object.entries(ROLE_LABEL).find(([key]) => key === role);
  if (!roleInfo) notFound();

  const { data: members } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("role", role)
    .order("created_at", { ascending: true });

  return (
    <main className="p-8">
      <h1 className="mb-6 text-2xl font-bold">{roleInfo[1]} メンバー</h1>

      {members && members.length > 0 ? (
        <ul className="space-y-2">
          {members.map((m, i) => (
            <li key={i} className="rounded border px-4 py-2">
              {m.display_name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">まだメンバーがいません</p>
      )}
    </main>
  );
}
