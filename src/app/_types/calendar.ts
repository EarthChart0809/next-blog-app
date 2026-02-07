export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: "meeting" | "contest" | "custom";
};
