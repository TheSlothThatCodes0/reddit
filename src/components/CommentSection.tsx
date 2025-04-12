"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUp, ArrowDown, MessageSquare, MoreHorizontal } from 'lucide-react';
import type { Comment } from '@/types/comment';

type CommentSectionProps = {
  comments: Comment[];
  postId: string;
};

const CommentSection = ({ comments, postId }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the comment to an API
    alert(`Comment submitted: ${newComment}`);
    setNewComment('');
    setIsCommentBoxOpen(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-md shadow-sm overflow-hidden">
      {/* Comment prompt button */}
      {!isCommentBoxOpen && (
        <div
          className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
          onClick={() => setIsCommentBoxOpen(true)}
        >
          <div className="flex items-center text-gray-500">
            <MessageSquare size={16} className="mr-2" />
            <span>Add a comment</span>
          </div>
        </div>
      )}

      {/* Comment form */}
      {isCommentBoxOpen && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={4}
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 font-medium text-sm"
                disabled={!newComment.trim()}
              >
                Comment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments list */}
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h3>
        
        {comments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
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
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);

  const handleUpvote = () => {
    if (voteStatus === 'up') {
      setUpvotes(upvotes - 1);
      setVoteStatus(null);
    } else {
      setUpvotes(voteStatus === 'down' ? upvotes + 2 : upvotes + 1);
      setVoteStatus('up');
    }
  };

  const handleDownvote = () => {
    if (voteStatus === 'down') {
      setUpvotes(upvotes + 1);
      setVoteStatus(null);
    } else {
      setUpvotes(voteStatus === 'up' ? upvotes - 2 : upvotes - 1);
      setVoteStatus('down');
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
      <div className="flex items-start">
        <div className="flex items-center mr-2">
          <div className="flex items-center space-x-1">
            <button className="vote-button flex items-center" onClick={handleUpvote}>
              <ArrowUp 
                size={14} 
                className={voteStatus === 'up' ? "text-orange-500" : "text-gray-500"} 
              />
            </button>
            <span className="text-xs font-medium">{upvotes}</span>
            <button className="vote-button flex items-center" onClick={handleDownvote}>
              <ArrowDown 
                size={14} 
                className={voteStatus === 'down' ? "text-blue-500" : "text-gray-500"} 
              />
            </button>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center mb-1">
            <Link 
              href={`/u/${comment.username}`} 
              className="text-xs font-medium text-gray-900 dark:text-gray-300 hover:underline mr-2"
            >
              u/{comment.username}
            </Link>
            <span className="text-xs text-gray-500">• {comment.timePosted}</span>
          </div>
          <div className="text-gray-800 dark:text-gray-300 text-sm">
            {comment.content}
          </div>
          <div className="mt-2 flex text-xs text-gray-500">
            <button className="flex items-center mr-4 hover:text-gray-700 dark:hover:text-gray-300">
              <MessageSquare size={12} className="mr-1" />
              <span>Reply</span>
            </button>
            <button className="flex items-center hover:text-gray-700 dark:hover:text-gray-300">
              <MoreHorizontal size={14} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;