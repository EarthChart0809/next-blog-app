import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

type RouteParams = {
  params: Promise<{ id: string }>;
};

type RequestBody = {
  title: string;
  content: string;
  coverImageURL: string;
  categoryIds: string[];
  published?: boolean; 
};

export const PUT = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    const { id } = await routeParams.params;
    const body: RequestBody = await req.json();

    const categories = await prisma.category.findMany({
      where: { id: { in: body.categoryIds } },
    });
    if (categories.length !== body.categoryIds.length) {
      return NextResponse.json(
        { error: "invalid categoryIds" },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.postCategory.deleteMany({ where: { postId: id } });
      if (body.categoryIds.length > 0) {
        await tx.postCategory.createMany({
          data: body.categoryIds.map((cid) => ({
            postId: id,
            categoryId: cid,
          })),
        });
      }
      await tx.post.update({
        where: { id },
        data: {
          title: body.title,
          content: body.content,
          coverImageURL: body.coverImageURL,
          published: body.published ?? false, // 公開フラグ更新
        },
      });
    });

    const postWithCats = await prisma.post.findUnique({
      where: { id },
      include: { categories: { include: { category: true } } },
    });

    if (!postWithCats) {
      return NextResponse.json(
        { error: "投稿が見つかりません" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: postWithCats.id,
      title: postWithCats.title,
      content: postWithCats.content,
      coverImageURL: postWithCats.coverImageURL,
      createdAt: postWithCats.createdAt,
      updatedAt: postWithCats.updatedAt,
      published: postWithCats.published, // 追加
      categories: postWithCats.categories.map((c) => c.category),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の変更に失敗しました" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    const { id } = await routeParams.params;
    const post = await prisma.post.delete({ where: { id } });
    return NextResponse.json({ msg: `「${post.title}」を削除しました。` });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の削除に失敗しました" },
      { status: 500 },
    );
  }
};
