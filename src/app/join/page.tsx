"use client";
import { useState } from "react";

export default function JoinPage() {
  const pdfOptions = [
    { label: "機構班（PDF）", path: "/docs/CAD_education.pdf" },
    { label: "回路班（PDF）", path: "/docs/circuit.pdf" },
  ];

  const [pdfs, setPdfs] = useState<string[]>([]);

  const addPdf = (path: string) => {
    setPdfs((prev) => (prev.includes(path) ? prev : [...prev, path]));
  };

  const removePdf = (path: string) => {
    setPdfs((prev) => prev.filter((p) => p !== path));
  };

  const downloadPdf = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop() || "file.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <main className="mx-auto max-w-4xl space-y-12 px-4 py-10">
      {/* 部活紹介 */}
      <section>
        <h1 className="text-2xl font-bold">福祉科学研究会について</h1>
        <p className="mt-4 text-sm leading-relaxed">
          福祉科学研究会では、レスキューロボットコンテストを中心に、
          機構・回路・プログラムの3班に分かれてロボット製作を行っています。
          初心者からでも参加可能です。
        </p>
      </section>

      {/* 活動スケジュール */}
      <section>
        <h2 className="text-xl font-bold">活動スケジュール</h2>
        <ul className="mt-4 list-disc pl-5 text-sm">
          <li>活動日：週2回（隔週水曜日 + 任意活動日）</li>
          <li>場所：部室 / 実習室</li>
          <li>大会：レスキューロボットコンテスト</li>
        </ul>
      </section>

      {/* 体験入部資料 */}
      <section>
        <h2 className="text-xl font-bold">体験入部資料</h2>

        <div className="mt-4 space-y-2">
          <a
            href="https://your-github-pages-url"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded border p-3 hover:bg-gray-50"
          >
            プログラム班（Web資料）
          </a>

          <div className="flex gap-2">
            {pdfOptions.map((opt) => (
              <button
                key={opt.path}
                onClick={() => addPdf(opt.path)}
                className="rounded border px-3 py-1 hover:bg-gray-50"
              >
                {opt.label}
              </button>
            ))}

            <button
              onClick={() => setPdfs(pdfOptions.map((o) => o.path))}
              className="rounded border px-3 py-1 hover:bg-gray-50"
            >
              すべて表示
            </button>
          </div>
        </div>

        {pdfs.length > 0 && (
          <div className="mt-4 space-y-6">
            {pdfs.map((p) => (
              <div key={p}>
                <div className="mb-2 flex items-center gap-2">
                  <strong>{p.split("/").pop()}</strong>
                  <button
                    onClick={() => downloadPdf(p)}
                    className="rounded border px-3 py-1"
                  >
                    ダウンロード
                  </button>
                  <button
                    onClick={() => removePdf(p)}
                    className="rounded border px-3 py-1"
                  >
                    閉じる
                  </button>
                </div>
                <iframe src={p} width="100%" height="600" />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
