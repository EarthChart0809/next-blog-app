export type Task = {
  id: string;
  title: string;
  date: string; // ISO
  type: "CONTEST" | "EVENT";
};
