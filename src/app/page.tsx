"use client";

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Feed from '@/components/Feed';
import PopularPosts from '@/components/PopularPosts';
import { getForYouFeed, getTrendingPosts } from '@/lib/supabase/api';
import { Post } from '@/types/post';

export default function Home() {
  const [feedType, setFeedType] = useState<'forYou' | 'trending'>('forYou');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { posts, error } = feedType === 'forYou' 
          ? await getForYouFeed() 
          : await getTrendingPosts();
        
        if (error) {
          setError(error);
        } else {
          setPosts(posts);
        }
      } catch (err: any) {
        setError("Failed to load posts");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [feedType]);

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar 
        feedType={feedType}
        onSelectFeed={(type) => setFeedType(type)}
      />
      <Feed 
        feedType={feedType} 
        posts={posts} 
        isLoading={isLoading}
        error={error}
      />
      <PopularPosts />
    </div>
  );
}
