"use client";

import Link from 'next/link';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Comment } from '@/types/comment';
import { SAMPLE_POSTS } from '@/data/sample-posts';

type UserCommentProps = {
  comment: Comment;
};

const UserComment = ({ comment }: UserCommentProps) => {
  // Find the associated post for context
  const associatedPost = SAMPLE_POSTS.find(post => post.id === comment.postId);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 shadow-sm">
      <div className="text-xs text-gray-500 mb-1">
        <Link href={`/r/${associatedPost?.subredditName || 'unknown'}`} className="hover:underline">
          r/{associatedPost?.subredditName || 'unknown'}
        </Link>
        {' • '}
        <Link href={`/r/${associatedPost?.subredditName || 'unknown'}/${comment.postId}`} className="hover:underline">
          {associatedPost?.title || 'Unknown Post'}
        </Link>
        {' • '}
        {comment.timePosted}
      </div>

      <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">
        {comment.content}
      </div>

      <div className="flex items-center text-xs text-gray-500">
        <div className="flex items-center">
          <button className="hover:bg-gray-200 dark:hover:bg-gray-600 p-1 rounded">
            <ArrowUp size={14} />
          </button>
          <span className="mx-1">{comment.upvotes}</span>
          <button className="hover:bg-gray-200 dark:hover:bg-gray-600 p-1 rounded">
            <ArrowDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserComment;
