import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Post } from "@/generated/prisma/client";

type RouteParams = {
  params: Promise<{ id: string }>;
};

type RequestBody = {
  title: string;
  content: string;
  coverImageURL: string;
  categoryIds: string[];
};

// PUT（更新） 
export const PUT = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    const { id } = await routeParams.params;
    const body: RequestBody = await req.json();

    // ① categoryIds の検証（ここで不正なら即失敗させる）
    const categories = await prisma.category.findMany({
      where: { id: { in: body.categoryIds } },
    });

    if (categories.length !== body.categoryIds.length) {
      throw new Error("invalid categoryIds");
    }

    // ② トランザクション開始
    const post = await prisma.$transaction(async (tx) => {
      // 中間テーブルを全削除
      await tx.postCategory.deleteMany({
        where: { postId: id },
      });

      // 中間テーブルを再作成
      await tx.postCategory.createMany({
        data: body.categoryIds.map((cid) => ({
          postId: id,
          categoryId: cid,
        })),
      });

      // 本体を更新
      return tx.post.update({
        where: { id },
        data: {
          title: body.title,
          content: body.content,
          coverImageURL: body.coverImageURL,
        },
      });
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の変更に失敗しました" },
      { status: 500 },
    );
  }
};

// DELETE（削除）
export const DELETE = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    const { id } = await routeParams.params;

    const post: Post = await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({
      msg: `「${post.title}」を削除しました。`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の削除に失敗しました" },
      { status: 500 },
    );
  }
};
