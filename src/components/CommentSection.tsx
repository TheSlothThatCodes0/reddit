"use client";

import { useState } from 'react';
import { ArrowUp, ArrowDown, MessageSquare, MoreHorizontal } from 'lucide-react';
import type { Comment } from '@/types/comment';

type CommentSectionProps = {
  comments: Comment[];
  postId: string;
};

const CommentSection = ({ comments, postId }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the comment to an API
    alert(`Comment submitted: ${newComment}`);
    setNewComment('');
  };
  
  return (
    <div>
      {/* Comment form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 mb-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What are your thoughts?"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium text-sm"
              disabled={!newComment.trim()}
            >
              Comment
            </button>
          </div>
        </form>
      </div>
      
      {/* Comments list */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            All Comments ({comments.length})
          </h3>
        </div>
        
        {comments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="p-4 hover:bg-gray-700 dark:hover:bg-gray-850">
      <div className="flex items-center mb-1">
        <span className="text-xs font-medium text-gray-800 dark:text-gray-300">
          u/{comment.authorName}
        </span>
        <span className="text-xs text-gray-500 ml-2">
          {comment.timePosted}
        </span>
      </div>
      
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
        {comment.content}
      </div>
      
      <div className="flex items-center text-xs text-gray-500">
        <div className="flex items-center mr-4">
          <button className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded">
            <ArrowUp size={14} />
          </button>
          <span className="mx-1">{comment.upvotes}</span>
          <button className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded">
            <ArrowDown size={14} />
          </button>
        </div>
        
        <button className="flex items-center mr-4 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 px-2 rounded">
          <MessageSquare size={14} className="mr-1" />
          <span>Reply</span>
        </button>
        
        <button className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded">
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
