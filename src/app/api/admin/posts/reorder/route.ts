import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const ids = Array.isArray(body?.ids) ? body.ids : null;
    if (!ids)
      return NextResponse.json({ error: "ids required" }, { status: 400 });

    // ids の順序で order を更新
    const operations = ids.map((id: string, index: number) =>
      prisma.post.update({ where: { id }, data: { order: index } }),
    );

    await prisma.$transaction(operations);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "並び替えの保存に失敗しました" },
      { status: 500 },
    );
  }
};
