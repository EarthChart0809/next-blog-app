import { CalendarEvent } from "@/types/calendar";

export function generateBiWeeklyMeetings(
  year: number,
  month: number,
  startDate: string, // YYYY-MM-DD
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const start = new Date(startDate);

  for (
    let d = new Date(year, month, 1);
    d.getMonth() === month;
    d.setDate(d.getDate() + 1)
  ) {
    if (d.getDay() !== 3) continue; // 水曜

    const diff = Math.floor(
      (d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diff >= 0 && diff % 14 === 0) {
      events.push({
        id: `meeting-${d.toISOString()}`,
        title: "定例ミーティング",
        date: d.toISOString().slice(0, 10),
        type: "meeting",
      });
    }
  }

  return events;
}
