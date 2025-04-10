"use client";

import Link from 'next/link';
import { ArrowUp, ArrowDown, MessageSquare, Share2, Bookmark } from 'lucide-react';
import type { Post } from '@/types/post';

type PostDetailProps = {
  post: Post;
};

const PostDetail = ({ post }: PostDetailProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
      <div className="flex">
        {/* Vote column */}
        <div className="w-12 bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-4 rounded-l-lg">
          <button className="vote-button text-gray-400 hover:text-orange-500">
            <ArrowUp size={20} />
          </button>
          <span className="text-xs font-medium my-1">{post.upvotes}</span>
          <button className="vote-button text-gray-700 hover:text-blue-500">
            <ArrowDown size={20} />
          </button>
        </div>
        
        {/* Post content */}
        <div className="flex-1 p-4">
          {/* Post header */}
          <div className="text-xs text-gray-500 mb-2">
            Posted by <Link href={`/user/${post.authorName}`} className="text-gray-500 hover:underline">u/{post.authorName}</Link> in <Link href={`/r/${post.subredditName}`} className="text-gray-500 hover:underline">r/{post.subredditName}</Link> • {post.timePosted}
          </div>
          
          {/* Post title */}
          <h1 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            {post.title}
          </h1>
          
          {/* Post content */}
          <div className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
            {post.content}
          </div>
          
          {/* Post actions */}
          <div className="flex text-gray-500 text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex items-center mr-6 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1">
              <MessageSquare size={16} className="mr-1" />
              <span>{post.commentCount} Comments</span>
            </div>
            
            <div className="flex items-center mr-6 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1">
              <Share2 size={16} className="mr-1" />
              <span>Share</span>
            </div>
            
            <div className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1">
              <Bookmark size={16} className="mr-1" />
              <span>Save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
