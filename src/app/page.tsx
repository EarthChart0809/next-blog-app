"use client";

const title = "Fukaken";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-[320px] text-center">
        {/* タイトル */}
        <h1 className="font-logo mb-4 text-4xl tracking-widest text-black">
          {title.split("").map((char, i) => (
            <span
              key={i}
              className="animate-fade-in inline-block opacity-0"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* サブタイトル */}
        <p className="mb-10 text-xs tracking-[0.3em] text-gray-600">
          福祉科学研究会
        </p>

        {/* メニュー */}
        <div className="flex flex-col gap-3">
          <a
            href="/calendar"
            className="border border-gray-300 py-2 text-sm text-black transition hover:border-black"
          >
            ゲストで見る
          </a>

          <a
            href="/signup"
            className="border border-black bg-black py-2 text-sm text-white transition hover:bg-white hover:text-black"
          >
            新規登録
          </a>

          <a
            href="/login"
            className="border border-gray-300 py-2 text-sm text-black transition hover:border-black"
          >
            ログイン
          </a>
        </div>
      </div>
    </main>
  );
}
