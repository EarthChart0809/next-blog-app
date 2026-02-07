import { useEffect, useState } from "react";
import { getMonthMatrix } from "@/lib/calendar/date";
import { generateBiWeeklyMeetings } from "@/lib/calendar/recurring";
import { fetchTasks } from "@/lib/tasks/fetchTasks";
import type { CalendarEvent } from "@/app/_types/calendar";

type Props = {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
};

const weekLabels = ["日", "月", "火", "水", "木", "金", "土"];

export function Calendar({ year, month, onPrev, onNext }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const weeks = getMonthMatrix(year, month);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const meetings = generateBiWeeklyMeetings(year, month, "2024-04-10");

      const tasks = await fetchTasks();
      const taskEvents: CalendarEvent[] = (tasks ?? []).map((t: any) => ({
        id: t.id,
        title: t.title,
        date: (t.date || "").slice(0, 10),
        type: t.type === "CONTEST" ? "contest" : "custom",
      }));

      if (mounted) setEvents([...meetings, ...taskEvents]);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [year, month]);

  return (
    <div className="p-4">
      <header className="mb-4 flex justify-between">
        <button onClick={onPrev}>←</button>
        <h2>
          {year}年 {month + 1}月
        </h2>
        <button onClick={onNext}>→</button>
      </header>

      <div className="mb-1 grid grid-cols-7 text-center text-sm text-gray-500">
        {weekLabels.map((d) => (
          <div key={d} className="py-2 font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((date) => {
          const day = date.toISOString().slice(0, 10);
          const dayEvents = events.filter((e) => e.date === day);

          const isToday = day === new Date().toISOString().slice(0, 10);
          const isCurrentMonth = date.getMonth() === month;

          return (
            <div
              key={day}
              className={`h-28 rounded-lg border p-2 text-sm transition ${
                isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
              } ${isToday ? "border-blue-500 ring-1 ring-blue-300" : ""} hover:shadow-sm`}
            >
              <div className="text-right font-semibold">{date.getDate()}</div>

              <div className="mt-1 space-y-1">
                {dayEvents.map((e) => (
                  <span
                    key={e.id}
                    className={`block rounded-full px-2 py-0.5 text-xs ${
                      e.type === "meeting" ? "bg-blue-100 text-blue-700" : ""
                    } ${e.type === "contest" ? "bg-red-100 text-red-700" : ""} ${
                      e.type === "custom" ? "bg-green-100 text-green-700" : ""
                    }`}
                  >
                    {e.title}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
