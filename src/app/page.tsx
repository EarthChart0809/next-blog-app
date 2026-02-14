"use client";

const title = "Fukaken";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="space-y-8 text-center">
        <h1 className="font-logo text-6xl tracking-wide">
          {title.split("").map((char, i) => (
            <span
              key={i}
              className="animate-fade-in inline-block opacity-0"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {char}
            </span>
          ))}
        </h1>

        <p className="text-sm tracking-widest">福祉科学研究会</p>

        <div className="flex flex-col gap-3 pt-6">
          <a href="/calendar" className="border border-black py-2">ゲストで見る</a>
          <a href="/signup" className="border border-black py-2 text-gray-400">新規登録</a>
          <a href="/login" className="border border-black py-2">ログイン</a>
        </div>
      </div>
    </main>
  );
}
