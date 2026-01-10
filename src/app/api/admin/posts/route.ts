import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { Post } from "@/generated/prisma/client";

type RequestBody = {
  title: string;
  content: string;
  coverImageURL: string;
  categoryIds: string[];
};

export const POST = async (req: NextRequest) => {
  try {
    const { title, content, coverImageURL, categoryIds } =
      (await req.json()) as RequestBody;

    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });
    if (categories.length !== categoryIds.length) {
      return NextResponse.json(
        { error: "指定されたカテゴリのいくつかが存在しません" },
        { status: 400 },
      );
    }

    // トランザクションで投稿と中間テーブルを作成
    const createdPost = await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: { title, content, coverImageURL },
      });
      await Promise.all(
        categoryIds.map((categoryId) =>
          tx.postCategory.create({
            data: { postId: post.id, categoryId },
          }),
        ),
      );
      return post;
    });

    // 作成した投稿をカテゴリ込みで再取得して categories をフラット化して返す
    const postWithCats = await prisma.post.findUnique({
      where: { id: createdPost.id },
      include: { categories: { include: { category: true } } },
    });

    const responseBody = postWithCats
      ? {
          id: postWithCats.id,
          title: postWithCats.title,
          content: postWithCats.content,
          coverImageURL: postWithCats.coverImageURL,
          createdAt: postWithCats.createdAt,
          updatedAt: postWithCats.updatedAt,
          categories: postWithCats.categories.map((c) => c.category),
        }
      : createdPost;

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の作成に失敗しました" },
      { status: 500 },
    );
  }
};
