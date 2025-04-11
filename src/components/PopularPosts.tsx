"use client";

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { SAMPLE_POSTS } from '@/data/sample-posts';

// Get a few posts to display as popular
const POPULAR_POSTS = [...SAMPLE_POSTS]
  .sort((a, b) => b.upvotes - a.upvotes)
  .slice(0, 4);

const PopularPosts = () => {
  return (
    <aside className="w-72 fixed top-28 right-20 bottom-0 overflow-y-auto">
      <div className="p-4">
        <div className="bg-white dark:bg-[#121212] rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Popular Posts
            </h2>
          </div>
          <div className="p-2">
            {POPULAR_POSTS.map((post) => (
              <Link 
                href={`/r/${post.subredditName}/${post.id}`}
                key={post.id}
                className="flex flex-col px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md mb-2"
              >
                <div className="flex items-start mb-1">
                  <span className="text-sm font-medium line-clamp-2">{post.title}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <ArrowUp size={12} className="text-orange-500 mr-1" />
                  <span>{post.upvotes} upvotes • r/{post.subredditName}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/popular"
              className="text-sm text-blue-500 font-medium block text-center"
            >
              See More Popular Posts
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PopularPosts;
