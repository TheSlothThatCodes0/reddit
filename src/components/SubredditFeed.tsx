"use client";

import Post from './Post';
import SubredditSidebar from './SubredditSidebar';
import { Post as PostType } from '@/types/post';
import { SubredditInfo } from '@/types/subreddit';

type SubredditFeedProps = {
  posts: PostType[];
  subreddit: SubredditInfo;
};

const SubredditFeed = ({ posts, subreddit }: SubredditFeedProps) => {
  return (
    <div className="w-full flex gap-6">
      {/* Main feed */}
      <div className="flex-1">
        <div className="flex flex-col space-y-4"> 
          {posts.length > 0 ? (
            posts.map((post) => (
              <div className="w-full rounded-xl overflow-hidden" key={post.id}> 
                <Post {...post} />
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500">No posts found in r/{subreddit.name}.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Sidebar with rules, moderators, etc. */}
      <div className="w-80 shrink-0">
        <SubredditSidebar subreddit={subreddit} />
      </div>
    </div>
  );
};

export default SubredditFeed;
