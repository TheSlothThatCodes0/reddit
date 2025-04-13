"use client";

import { useState, useEffect } from "react";
import { Comment } from "@/types/comment";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import { createComment, createCommentReply, voteOnComment, getUserVoteOnComment } from "@/lib/supabase/api";

type CommentItemProps = {
  comment: Comment;
  replies?: Comment[];
  depth?: number;
};

// Individual comment component with support for replies
const CommentItem = ({ comment, replies = [], depth = 0 }: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  // Load initial vote status
  useEffect(() => {
    const loadVoteStatus = async () => {
      const { voteStatus } = await getUserVoteOnComment(comment.id);
      setVoteStatus(voteStatus);
    };
    
    loadVoteStatus();
  }, [comment.id]);

  const handleUpvote = async () => {
    if (isVoting) return;
    setIsVoting(true);
    
    try {
      const prevStatus = voteStatus;
      
      // Optimistically update UI
      if (voteStatus === 'up') {
        setVoteStatus(null);
        setUpvotes(upvotes - 1);
      } else {
        setVoteStatus('up');
        setUpvotes(voteStatus === 'down' ? upvotes + 2 : upvotes + 1);
      }
      
      // Send to server
      const { success, error } = await voteOnComment(comment.id, true);
      
      if (!success) {
        // Revert on failure
        setVoteStatus(prevStatus);
        setUpvotes(comment.upvotes);
        console.error("Vote failed:", error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownvote = async () => {
    if (isVoting) return;
    setIsVoting(true);
    
    try {
      const prevStatus = voteStatus;
      
      // Optimistically update UI
      if (voteStatus === 'down') {
        setVoteStatus(null);
        setUpvotes(upvotes + 1);
      } else {
        setVoteStatus('down');
        setUpvotes(voteStatus === 'up' ? upvotes - 2 : upvotes - 1);
      }
      
      // Send to server
      const { success, error } = await voteOnComment(comment.id, false);
      
      if (!success) {
        // Revert on failure
        setVoteStatus(prevStatus);
        setUpvotes(comment.upvotes);
        console.error("Vote failed:", error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await createCommentReply(
        comment.postId, 
        comment.id, 
        replyContent
      );
      
      if (result.success) {
        // Successfully created reply
        setReplyContent("");
        setIsReplying(false);
        
        // Just reload the page without showing an alert
        setTimeout(() => window.location.reload(), 500);
      } else {
        setError(result.error || "Failed to post reply");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`relative ${depth > 0 ? 'ml-8' : ''}`}>
      {/* Left border for threaded replies */}
      {depth > 0 && (
        <div className="absolute left-[-16px] top-0 bottom-0 w-[2px] bg-gray-700"></div>
      )}
      
      <div className="bg-[#1A1A1B] p-3 rounded-lg mb-2">
        <div className="flex items-center mb-1">
          <div className="text-xs text-gray-400">
            <span className="font-medium text-gray-300">u/{comment.authorName}</span>
            <span className="mx-1">•</span>
            <span>{comment.timePosted}</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-300 mb-2">
          {comment.content}
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <div className="flex items-center mr-4">
            <button 
              onClick={handleUpvote}
              className="hover:bg-gray-800 p-1 rounded"
            >
              <ArrowUp size={14} className={voteStatus === 'up' ? 'text-orange-500' : ''} />
            </button>
            <span className="mx-1">{upvotes}</span>
            <button 
              onClick={handleDownvote}
              className="hover:bg-gray-800 p-1 rounded"
            >
              <ArrowDown size={14} className={voteStatus === 'down' ? 'text-blue-500' : ''} />
            </button>
          </div>
          
          <button 
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center hover:bg-gray-800 p-1 rounded"
            disabled={isSubmitting}
          >
            <MessageSquare size={14} className="mr-1" />
            <span>{isReplying ? 'Cancel' : 'Reply'}</span>
          </button>
        </div>
        
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-2 bg-[#272729] text-gray-200 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder={`Reply to ${comment.authorName}...`}
              rows={3}
              required
              disabled={isSubmitting}
            />
            {error && (
              <div className="text-red-500 text-xs mt-1">{error}</div>
            )}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-3 py-1 mr-2 text-xs bg-transparent text-gray-400 hover:bg-gray-800 rounded"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-3 py-1 text-xs bg-blue-500 text-white rounded ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Render replies */}
      {replies.length > 0 && (
        <div className="mt-1">
          {replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              replies={[]} // We don't support multi-level nesting for simplicity
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

type CommentSectionProps = {
  comments: Comment[];
  postId: string;
  isLoading?: boolean;
  error?: string | null;
};

// Main comment section component
const CommentSection = ({ comments, postId, isLoading = false, error = null }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Organize comments into a threaded structure
  const organizeComments = () => {
    const topLevelComments: Comment[] = [];
    const commentReplies: { [key: string]: Comment[] } = {};
    const existingCommentIds = new Set(comments.map(c => c.id));
    
    // First, separate top-level comments from replies
    comments.forEach(comment => {
      // A comment is top-level if it has no replyToId OR its parent doesn't exist
      if (!comment.replyToId || !existingCommentIds.has(comment.replyToId)) {
        topLevelComments.push(comment);
      } else {
        if (!commentReplies[comment.replyToId]) {
          commentReplies[comment.replyToId] = [];
        }
        commentReplies[comment.replyToId].push(comment);
      }
    });
    
    return { topLevelComments, commentReplies };
  };
  
  const { topLevelComments, commentReplies } = organizeComments();
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const result = await createComment(postId, newComment);
      
      if (result.success) {
        // Successfully created comment
        setNewComment("");
        
        // Just reload the page without showing an alert
        setTimeout(() => window.location.reload(), 500);
      } else {
        setSubmitError(result.error || "Failed to post comment");
      }
    } catch (err) {
      setSubmitError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">
        Comments ({comments.length})
      </h2>
      
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 bg-[#1A1A1B] text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="What are your thoughts?"
          rows={4}
          disabled={isSubmitting}
        />
        {submitError && (
          <div className="text-red-500 text-sm mt-1">{submitError}</div>
        )}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-500 text-white rounded ${
              isSubmitting || !newComment.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </form>
      
      {/* Comments list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : topLevelComments.length > 0 ? (
          topLevelComments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              replies={commentReplies[comment.id] || []} 
            />
          ))
        ) : (
          <div className="text-center py-8 bg-[#1A1A1B] rounded-lg">
            <p className="text-gray-400">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;