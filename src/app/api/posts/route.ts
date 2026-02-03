import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const revalidate = 0; // ◀ サーバサイドのキャッシュを無効化する設定
export const dynamic = "force-dynamic"; // ◀ 〃

export const GET = async (req: NextRequest) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true }, // 公開済みのみ返す
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        order: true,
        published: true,
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { order: "asc" },
    });

    const flattened = posts.map((p) => ({
      ...p,
      categories: p.categories.map((pc) => pc.category),
    }));

    return NextResponse.json(flattened);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の一覧の取得に失敗しました" },
      { status: 500 },
    );
  }
};
