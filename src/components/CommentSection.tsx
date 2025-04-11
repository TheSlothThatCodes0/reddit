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
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the comment to an API
    alert(`Comment submitted: ${newComment}`);
    setNewComment('');
    setIsCommentBoxOpen(false);
  };
  
  return (
    <div>
      {/* Comment prompt button */}
      {!isCommentBoxOpen && (
        <div 
          className="bg-[#1A1A1B] border max-w-1/5 border-[#272729] rounded-full py-2 px-4 mb-4 cursor-pointer"
          onClick={() => setIsCommentBoxOpen(true)}
        >
          <div className="text-gray-400 text-sm">Add a comment</div>
        </div>
      )}
      
      {/* Comment form - only shown when isCommentBoxOpen is true */}
      {isCommentBoxOpen && (
        <div className="bg-[#121212] rounded-lg shadow-sm p-4 mb-4">
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full border border-[#272729] rounded-md p-3 mb-3 bg-[#1A1A1B] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What are your thoughts?"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              autoFocus
            />
            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 text-gray-400 hover:text-gray-300 rounded-full font-medium text-sm"
                onClick={() => setIsCommentBoxOpen(false)}
              >
                Cancel
              </button>
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
      )}
      
      {/* Comments list */}
      <div className="bg-[#121212] rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 bg-[#1A1A1B] border-b border-[#272729]">
          <h3 className="text-sm font-medium text-white">
            All Comments ({comments.length})
          </h3>
        </div>
        
        {comments.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="divide-y divide-[#272729]">
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
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(comment.upvotes);

  const handleUpvote = () => {
    if (voteStatus === 'up') {
      setVoteStatus(null);
      setUpvotes(upvotes - 1);
    } else {
      setVoteStatus('up');
      setUpvotes(voteStatus === 'down' ? upvotes + 2 : upvotes + 1);
    }
  };

  const handleDownvote = () => {
    if (voteStatus === 'down') {
      setVoteStatus(null);
      setUpvotes(upvotes + 1);
    } else {
      setVoteStatus('down');
      setUpvotes(voteStatus === 'up' ? upvotes - 2 : upvotes - 1);
    }
  };

  return (
    <div className="p-4 hover:bg-[#1A1A1B]">
      <div className="flex items-center mb-1">
        <span className="text-xs font-medium text-gray-300">
          u/{comment.authorName}
        </span>
        <span className="text-xs text-gray-500 ml-2">
          {comment.timePosted}
        </span>
      </div>
      
      <div className="text-sm text-gray-300 mb-2">
        {comment.content}
      </div>
      
      <div className="flex items-center text-xs text-gray-400">
        <div className="flex items-center mr-4 bg-[#272729] rounded-full px-2 py-1">
          <button 
            className="p-0.5"
            onClick={handleUpvote}
          >
            <ArrowUp 
              size={14} 
              className={voteStatus === 'up' 
                ? "text-orange-500" 
                : "text-gray-500"} 
            />
          </button>
          <span className="mx-1">{upvotes}</span>
          <button 
            className="p-0.5"
            onClick={handleDownvote}
          >
            <ArrowDown 
              size={14}
              className={voteStatus === 'down' 
                ? "text-blue-500" 
                : "text-gray-500"}
            />
          </button>
        </div>
        
        <button className="flex items-center mr-4 bg-[#272729] rounded-full px-3 py-1">
          <MessageSquare size={14} className="mr-1 text-gray-500" />
          <span>Reply</span>
        </button>
        
        <button className="bg-[#272729] rounded-full p-1">
          <MoreHorizontal size={14} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default CommentSection;