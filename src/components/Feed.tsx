"use client";

import Post from './Post';
import { SAMPLE_POSTS } from '@/data/sample-posts';
import { Post as PostType } from '@/types/post';
import { Loader2 } from 'lucide-react';

type FeedProps = {
  feedType?: 'forYou' | 'trending' | string;
  posts?: PostType[];
  isLoading?: boolean;
  error?: string | null;
};

const Feed = ({ 
  feedType = 'forYou', 
  posts = SAMPLE_POSTS,
  isLoading = false,
  error = null
}: FeedProps) => {

  console.log(`Rendering Feed (${feedType}) with posts:`, posts);

  return (
    <div className="flex-1 overflow-x-hidden pb-8 pl-64 pr-72 pt-16">
      <div className="mx-auto max-w-2xl pt-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {feedType === 'forYou' ? 'Your Home Feed' : 'Trending Posts'}
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500">Loading your feed...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500">No posts found in your feed.</p>
            <p className="text-sm text-gray-500 mt-2">Try following more subreddits or check back later.</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4"> 
            {posts.map((post, index) => {
              console.log(`Rendering post ${index}:`, post); // Debug each post
              return (
                <div className="w-full rounded-xl overflow-hidden" key={post.id || index}> 
                  <Post {...post} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
