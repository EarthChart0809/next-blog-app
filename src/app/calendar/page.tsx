"use client";

import { useEffect, useReducer, useState } from "react";
import { Calendar } from "@/app/_components/calendar/Calendar";
import { SevenSeg } from "@/app/_components/calendar/SevenSeg";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

type State = { year: number; month: number };

export default function CalendarPage() {
  const today = new Date();

  const [state, dispatch] = useReducer(
    (s: State, action: "prev" | "next") => {
      if (action === "prev") {
        if (s.month === 0) return { year: s.year - 1, month: 11 };
        return { ...s, month: s.month - 1 };
      } else {
        if (s.month === 11) return { year: s.year + 1, month: 0 };
        return { ...s, month: s.month + 1 };
      }
    },
    { year: today.getFullYear(), month: today.getMonth() },
  );

  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const fetchContest = async () => {
      const todayStr = new Date().toISOString().slice(0, 10);

      const { data } = await supabase
        .from("Task")
        .select("title, date")
        .eq("type", "CONTEST")
        .gte("date", todayStr)
        .order("date", { ascending: true })
        .limit(1)
        .single();

      if (!data) return;

      const target = new Date(data.date);
      const diff = Math.ceil(
        (target.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      );

      setDaysLeft(diff);
      setTitle(data.title);
    };

    fetchContest();
  }, []);

  return (
    <div className="space-y-6">
      {daysLeft !== null && (
        <div className="text-center">
          <p className="mb-2 text-xs tracking-widest text-gray-500">
            {title} まで
          </p>
          <SevenSeg value={daysLeft} />
        </div>
      )}

      <Calendar
        year={state.year}
        month={state.month}
        onPrev={() => dispatch("prev")}
        onNext={() => dispatch("next")}
      />
    </div>
    
  );
}
