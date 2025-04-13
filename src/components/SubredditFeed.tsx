"use client";

import Post from './Post';
import SubredditSidebar from './SubredditSidebar';
import { Post as PostType } from '@/types/post';
import { SubredditInfo } from '@/types/subreddit';

type SubredditFeedProps = {
  posts: PostType[];
  subreddit: SubredditInfo;
  isLoading?: boolean;
};

const SubredditFeed = ({ 
  posts, 
  subreddit, 
  isLoading = false 
}: SubredditFeedProps) => {
  // Ensure proper typing
  const typedPosts: PostType[] = Array.isArray(posts) ? posts : [];
  const typedSubreddit: SubredditInfo = subreddit as SubredditInfo;
  const typedIsLoading: boolean = Boolean(isLoading);
  
  return (
    <div className="w-full flex gap-6">
      {/* Main feed */}
      <div className="flex-1">
        <div className="flex flex-col space-y-4"> 
          {typedIsLoading ? (
            // Loading skeleton
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))
          ) : typedPosts.length > 0 ? (
            typedPosts.map((post) => (
              <div className="w-full rounded-xl overflow-hidden" key={String(post.id)}> 
                <Post {...post} />
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500">No posts found in r/{typedSubreddit.name}.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Sidebar with rules, moderators, etc. */}
      <div className="w-80 shrink-0">
        <SubredditSidebar subreddit={typedSubreddit} />
      </div>
    </div>
  );
};

export default SubredditFeed;
