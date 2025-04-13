"use client";

import { useState, useEffect, useCallback } from 'react';
import { notFound } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import SubredditFeed from '@/components/SubredditFeed';
import SubredditHeader from '@/components/SubredditHeader';
import { getSubredditByName, getSubredditPostsByName, PostSortOption } from '@/lib/supabase/api';
import { Post } from '@/types/post';
import { SubredditInfo } from '@/types/subreddit';

export default function SubredditPage({ params }: { params: { subreddit: string } }) {
  const [subredditInfo, setSubredditInfo] = useState<SubredditInfo | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState<PostSortOption>('new');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0); // Add refresh key to force rerenders
  
  // Function to fetch posts with explicit type handling
  const fetchPosts = useCallback(async (subredditName: string, sort: PostSortOption) => {
    try {
      setIsLoading(true);
      
      const { posts: subredditPosts, error: postsError } = 
        await getSubredditPostsByName(
          String(subredditName), 
          sort
        );
      
      if (postsError) {
        setError(String(postsError));
      } else {
        // Make sure we get a fresh copy of the posts array
        setPosts(Array.isArray(subredditPosts) ? [...subredditPosts] : []);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("An error occurred while loading posts");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const loadSubredditInfo = async () => {
      setIsLoading(true);
      
      // Get subreddit info
      const { subreddit, error: subredditError } = await getSubredditByName(String(params.subreddit));
      
      if (subredditError || !subreddit) {
        setError(subredditError || `Subreddit r/${params.subreddit} not found`);
        setIsLoading(false);
        return;
      }
      
      // Format subreddit info for components
      const formattedSubreddit: SubredditInfo = {
        id: String(params.subreddit),
        name: String(subreddit.name),
        members: String(subreddit.memberCount),
        createdAt: String(subreddit.createdAt),
        description: subreddit.description ? String(subreddit.description) : undefined,
      };
      
      setSubredditInfo(formattedSubreddit);
      
      // Fetch posts using the separate function
      await fetchPosts(params.subreddit, sortBy);
    };
    
    loadSubredditInfo();
  }, [params.subreddit, sortBy, refreshKey, fetchPosts]);
  
  // Function to handle sort change without refresh button
  const handleSortChange = (newSort: PostSortOption) => {
    if (sortBy !== newSort) {
      setSortBy(newSort);
      setPosts([]); // Clear posts while loading
      setIsLoading(true);
    }
  };

  // If loading, show placeholder or loading state
  if (isLoading && !subredditInfo) {
    return (
      <div className="flex min-h-screen overflow-x-hidden">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden pb-8 pl-64 pt-16">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-300 dark:bg-gray-700"></div>
            <div className="max-w-5xl mx-auto px-4 pt-4">
              <div className="h-16 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !subredditInfo) {
    return (
      <div className="flex min-h-screen overflow-x-hidden">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden pb-8 pl-64 pt-16">
          <div className="max-w-5xl mx-auto p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">
              {error || `Subreddit r/${params.subreddit} not found`}
            </h1>
            <p>
              This subreddit may have been removed or doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden pb-8 pl-64 pt-16">
        <SubredditHeader subreddit={subredditInfo} />
        <div className="mx-auto max-w-5xl px-4 pt-4">
          {/* Sorting options - full width, no refresh button */}
          <div className="bg-white dark:bg-gray-800 p-3 mb-4 rounded-md flex">
            <button
              onClick={() => handleSortChange('new')}
              className={`px-3 py-1 rounded-full text-sm ${
                sortBy === 'new' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              New
            </button>
            <button
              onClick={() => handleSortChange('top')}
              className={`px-3 py-1 rounded-full text-sm ml-2 ${
                sortBy === 'top' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Top
            </button>
            <button
              onClick={() => handleSortChange('trending')}
              className={`px-3 py-1 rounded-full text-sm ml-2 ${
                sortBy === 'trending' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Trending
            </button>
          </div>
          
          <SubredditFeed 
            posts={posts} 
            subreddit={subredditInfo} 
            isLoading={isLoading}
            key={`feed-${sortBy}`} // Simpler key based just on sort option
          />
        </div>
      </div>
    </div>
  );
}
