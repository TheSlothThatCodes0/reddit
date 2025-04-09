"use client";

import Link from 'next/link';
import { ArrowUp, ArrowDown, MessageSquare, Share2 } from 'lucide-react';

type PostProps = {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  commentCount: number;
  subredditName: string;
  authorName: string;
  timePosted: string;
};

const Post = ({
  id,
  title,
  content,
  upvotes,
  commentCount,
  subredditName,
  authorName,
  timePosted,
}: PostProps) => {
  return (
    <div className="bg-white dark:bg-gray-200 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex">
        {/* Vote column */}
        <div className="w-12 bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-2">
          <button className="vote-button text-gray-400 hover:text-orange-500">
            <ArrowUp size={20} color='grey' />
          </button>
          <span className="text-xs font-medium my-1">{upvotes}</span>
          <button className="vote-button text-gray-700 hover:text-blue-500">
            <ArrowDown size={20} color='grey'/>
          </button>
        </div>
        
        {/* Post content */}
        <div className="flex-1 p-4">
          <div className="text-xs text-gray-500">
            Posted by <Link href={`/user/${authorName}`} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">u/{authorName}</Link> in <Link href={`/r/${subredditName}`} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">r/{subredditName}</Link> • {timePosted}
          </div>
          <Link href={`/r/${subredditName}/${id}`} className="block">
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
              {title}
            </h3>
          </Link>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {content}
          </p>
          <div className="flex text-gray-500 text-sm">
            <Link href={`/r/${subredditName}/${id}`} className="flex items-center mr-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              <MessageSquare size={16} className="mr-1" />
              <span>{commentCount} Comments</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
