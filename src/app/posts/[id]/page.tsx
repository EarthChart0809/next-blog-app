"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // ◀ 注目

import type { Post } from "@/app/_types/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import DOMPurify from "isomorphic-dompurify";

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 動的ルートパラメータから 記事id を取得 （URL:/posts/[id]）
  const { id } = useParams() as { id: string };

  // API から投稿を取得する処理
  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;

    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: "GET",
          cache: "no-store",
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
        const data = await res.json();
        const postData = Array.isArray(data) ? data[0] : data;
        if (mounted) setPost(postData as Post);
      } catch (e: any) {
        if (e.name === "AbortError") return;
        console.error(e);
        if (mounted) setPost(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchPost();

    return () => {
      mounted = false;
      ac.abort();
    };
  }, [id]);

  // 投稿データの取得中は「Loading...」を表示
  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  // 投稿データが取得できなかったらエラーメッセージを表示
  if (!post) {
    return <div>指定idの投稿の取得に失敗しました。</div>;
  }

  // HTMLコンテンツのサニタイズ
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  return (
    <main>
      <div className="space-y-2">
        <div className="mb-2 text-2xl font-bold">{post.title}</div>
        {(post.coverImage && post.coverImage.url) || post.coverImageURL ? (
          <div>
            {post.coverImage && post.coverImage.url ? (
              <Image
                src={post.coverImage.url}
                alt={post.title || "cover"}
                width={post.coverImage.width || 800}
                height={post.coverImage.height || 450}
                priority
                className="rounded-xl"
              />
            ) : (
              <img
                src={post.coverImageURL}
                alt={post.title || "cover"}
                width={800}
                height={450}
                className="w-full rounded-xl object-cover"
              />
            )}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-xl bg-gray-100">
            画像が登録されていません
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
      </div>
    </main>
  );
};

export default Page;
