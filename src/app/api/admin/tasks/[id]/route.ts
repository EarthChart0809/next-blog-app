import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: { id: string } | Promise<{ id: string }>;
};

/**
 * Task 更新
 */
export async function PUT(req: NextRequest, context: Context) {
  const paramsResolved = await (context.params as any);
  const id = paramsResolved.id;

  const body = await req.json();
  const { title, date, type } = body;

  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      date: new Date(date),
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
