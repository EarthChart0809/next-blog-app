"use client";
import { useState } from "react";

type Props = {
  title: string;
  summary: string;
  tools: string[];
};

export default function DivisionCard({ title, summary, tools }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl border border-black p-6 transition-colors duration-300 hover:bg-black hover:text-white"
    >
      <h3 className="text-lg font-semibold">{title}</h3>

      {!hovered ? (
        <p className="mt-4 text-sm leading-relaxed">{summary}</p>
      ) : (
        <ul className="mt-4 list-disc pl-5 text-sm">
          {tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
