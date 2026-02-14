"use client";
import { useState } from "react";
import DivisionCard from "@/app/_components/DivisionCard";
import FadeInSection from "@/app/_components/FadeInSection";

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
    <main className="bg-white-50 mx-auto max-w-4xl space-y-16 px-4 py-14">
      {/* 部活紹介 */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          福祉科学研究会について
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-700">
          福祉科学研究会では、レスキューロボットコンテストを中心に、
          機構・回路・プログラムの3班に分かれてロボット製作を行っています。
          初心者からでも参加可能です。
        </p>
      </section>

      {/* 活動スケジュール */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold">活動スケジュール</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>・活動日：月～金</li>
          <li>・場所：ものづくり工房</li>
          <li>・大会：レスキューロボットコンテスト ・ 廃炉創造ロボコン</li>
        </ul>
      </section>

      {/* 道具紹介 */}
       <section className="grid gap-8 md:grid-cols-3">
        <FadeInSection>
          <DivisionCard
            title="機構班"
            summary="ロボットの骨組みや機構設計を担当します。工作が好きな人向け。"
            tools={["ボール盤", "CAD", "3Dプリンタ", "各種工具"]}
          />
        </FadeInSection>

        <FadeInSection>
          <DivisionCard
            title="回路班"
            summary="センサやモータ制御の回路を設計します。電子工作が中心。"
            tools={["マルチメータ", "はんだごて", "ESP32", "ブレッドボード"]}
          />
        </FadeInSection>

        <FadeInSection>
          <DivisionCard
            title="プログラム班"
            summary="ロボットの制御や認識をプログラムで実装します。初心者歓迎。"
            tools={["Raspberry Pi", "Python", "C/C++", "ROS"]}
          />
        </FadeInSection>
      </section>
    
      {/* 体験入部資料 */}
      <section>
        <h2 className="text-xl font-bold">体験入部資料</h2>

        <div className="mt-4 space-y-2">
          <a
            href="https://your-github-pages-url"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-gray-200 p-4 text-sm transition hover:bg-gray-50"
          >
            プログラム班（Web資料）
          </a>

          <div className="mt-4 flex flex-wrap gap-2">
            {pdfOptions.map((opt) => (
              <button
                key={opt.path}
                onClick={() => addPdf(opt.path)}
                className="rounded-md border border-gray-300 px-4 py-1.5 text-sm transition hover:bg-gray-50"
              >
                {opt.label}
              </button>
            ))}

            <button
              onClick={() => setPdfs(pdfOptions.map((o) => o.path))}
              className="rounded-md border border-gray-400 px-4 py-1.5 text-sm font-medium transition hover:bg-gray-100"
            >
              すべて表示
            </button>
          </div>
        </div>

        {pdfs.length > 0 && (
          <div className="mt-4 space-y-6">
            {pdfs.map((p) => (
              <div key={p}>
                <div className="overflow-hidden rounded-lg border border-gray-200">
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
