import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { Post } from "@/generated/prisma/client";
import { supabase } from "@/utils/supabase"; // ◀ 追加

type RequestBody = {
  title: string;
  content: string;
  coverImageURL: string;
  categoryIds: string[];
  published?: boolean;
};

export const GET = async (req: NextRequest) => {
  try {
    const posts = await prisma.post.findMany({
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
      // 追加: クライアントでカテゴリ一致判定できるように ID 配列を返す
      categoryIds: p.categories.map((pc) => pc.category.id),
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

export const POST = async (req: Request) => {
  // JWTトークンの検証・認証 (失敗したら 401 Unauthorized を返す)
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 401 });

  try {
    const body = await req.json();
    const {
      title,
      content,
      coverImageURL,
      categoryIds = [],
      published = false,
    } = body;

    // prisma が既にこのファイルでインポートされている想定:
    // import { prisma } from "@/lib/prisma";
    const post = await prisma.post.create({
      data: {
        title,
        content,
        coverImageURL,
        published,
        categories: {
          create: categoryIds.map((categoryId: string) => ({ categoryId })),
        },
      },
      include: { categories: { select: { category: true } } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿の作成に失敗しました" },
      { status: 500 },
    );
  }
};
