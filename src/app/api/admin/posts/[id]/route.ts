import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Post } from "@/generated/prisma/client";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
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
    categories: post.categories.map((c) => ({
      category: {
        id: c.category.id,
        name: c.category.name,
      },
    })),
  });
}
