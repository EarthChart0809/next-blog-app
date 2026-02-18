import Link from "next/link";
import { ROLE_LABEL } from "@/lib/role";

export default function GroupsPage() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-2xl font-bold">班一覧</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Object.entries(ROLE_LABEL).map(([key, label]) => (
          <Link
            key={key}
            href={`/groups/${key}`}
            className="rounded-lg border p-6 transition hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{label}</h2>
            <p className="mt-1 text-sm text-gray-500">メンバー一覧を見る →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
