"use client";

import { useReducer } from "react";
import { Calendar } from "@/app/_components/calendar/Calendar";

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

  return (
    <Calendar
      year={state.year}
      month={state.month}
      onPrev={() => dispatch("prev")}
      onNext={() => dispatch("next")}
    />
  );
}
