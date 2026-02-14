"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import PostSummary from "@/app/_components/PostSummary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const request = "/api/posts";
        const res = await fetch(request, {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) {
          setPosts(null);
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        const data = await res.json();

        let postsData: Post[] = [];
        if (Array.isArray(data)) {
          postsData = data;
        } else if (
          data &&
          typeof data === "object" &&
          Array.isArray((data as { contents?: unknown }).contents)
        ) {
          postsData = (data as { contents: Post[] }).contents;
        } else {
          postsData = [];
        }

        setPosts(postsData);
      } catch (e: unknown) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました",
        );
      }
    };
    fetchPosts();
  }, []);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (!posts) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <main>
      <div className="mb-2 text-2xl font-bold">Main</div>
      <div className="space-y-3">
        {posts.map((post) => (
          <PostSummary key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Page;
