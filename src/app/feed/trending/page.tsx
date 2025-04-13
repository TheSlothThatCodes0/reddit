"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import PopularCommunities from "@/components/PopularCommunities";
import { Post } from "@/types/post";
import { getTrendingPosts } from "@/lib/supabase/api";

export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrendingPosts = async () => {
      setIsLoading(true);
      
      const { posts, error } = await getTrendingPosts();
      setPosts(posts);
      setError(error);
      
      setIsLoading(false);
    };

    loadTrendingPosts();
  }, []);

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <Feed 
        feedType="trending" 
        posts={posts} 
        isLoading={isLoading}
        error={error}
      />
      <PopularCommunities />
    </div>
  );
}
