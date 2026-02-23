import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: { id: string } | Promise<{ id: string }>;
};

// 追加: タスク取得
export async function GET(_: NextRequest, context: Context) {
  const paramsResolved = await (context.params as any);
  const id = paramsResolved.id;

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // クライアント側が startAt プロパティを期待しているので変換して返す
  return NextResponse.json({
    id: task.id,
    title: task.title,
    startAt: task.date instanceof Date ? task.date.toISOString() : task.date,
    type: task.type,
  });
}

/**
 * Task 更新
 */
export async function PUT(req: NextRequest, context: Context) {
  const paramsResolved = await (context.params as any);
  const id = paramsResolved.id;

  const body = await req.json();
  // クライアントが startAt を送るケースに対応
  const { title, date, startAt, type } = body;
  const dateValue = startAt ?? date;

  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      date: new Date(dateValue),
      type,
    },
  });

  return NextResponse.json(task);
}

/**
 * Task 削除
 */
export async function DELETE(_: NextRequest, context: Context) {
  const paramsResolved = await (context.params as any);
  const id = paramsResolved.id;

  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
