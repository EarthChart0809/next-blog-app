"use client";
import type { Post } from "@/app/_types/Post";
import Link from "next/link";
import React from "react";

type Props = {
  post: Post;
};

const PostSummary: React.FC<Props> = ({ post }) => {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block border border-slate-400 p-3"
    >
      <div className="mb-1 text-lg font-bold">{post.title}</div>
      <div
        className="line-clamp-3"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </Link>
  );
};

export default PostSummary;
