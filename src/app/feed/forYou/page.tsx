"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import PopularCommunities from "@/components/PopularCommunities";
import { Post } from "@/types/post";
import { getForYouFeed } from "@/lib/supabase/api";

export default function ForYouPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeed = async () => {
      setIsLoading(true);
      
      const { posts, error } = await getForYouFeed();
      setPosts(posts);
      setError(error);
      
      setIsLoading(false);
    };

    loadFeed();
  }, []);

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <Feed 
        feedType="forYou" 
        posts={posts} 
        isLoading={isLoading}
        error={error}
      />
      <PopularCommunities />
    </div>
  );
}
