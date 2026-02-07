import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { date: "asc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.title || !body.date) {
      return NextResponse.json({ error: "title and date are required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: body.title,
        date: new Date(body.date),
        type: body.type,
      },
    });

    console.log("task created:", task);
    return NextResponse.json(task);
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}
