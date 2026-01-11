import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { categories: { include: { category: true } } },
    });

    if (!post) {
      return NextResponse.json(
        { error: `id='${id}'の投稿記事は見つかりませんでした` },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: post.id,
      title: post.title,
      content: post.content,
      coverImageURL: post.coverImageURL,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      published: post.published, // 編集画面で初期チェック状態を取得する
      categories: post.categories.map((c) => c.category),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿の取得に失敗しました" },
      { status: 500 },
    );
  }
}
