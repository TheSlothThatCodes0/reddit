"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUp, ArrowDown, MessageSquare, Award, Share2 } from 'lucide-react';
import { Post as PostType } from '@/types/post';
import { voteOnPost, getUserVoteOnPost } from '@/lib/supabase/api';

type PostDetailProps = {
  post: PostType;
};

const PostDetail = ({ post }: PostDetailProps) => {
  const router = useRouter();
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [isVoting, setIsVoting] = useState(false);

  // Fetch the user's current vote status when component mounts
  useEffect(() => {
    const fetchVoteStatus = async () => {
      const { voteStatus: currentVote } = await getUserVoteOnPost(post.id);
      setVoteStatus(currentVote);
    };
    
    fetchVoteStatus();
  }, [post.id]);

  const handleUpvote = async () => {
    if (isVoting) return;
    setIsVoting(true);
    
    // Optimistic UI update
    if (voteStatus === 'up') {
      setVoteStatus(null);
      setUpvotes(upvotes - 1);
    } else {
      setVoteStatus('up');
      setUpvotes(voteStatus === 'down' ? upvotes + 2 : upvotes + 1);
    }
    
    try {
      // Send vote to database
      const { success, error } = await voteOnPost(post.id, true);
      
      if (!success && error) {
        // Revert optimistic update if error occurs
        console.error("Failed to register upvote:", error);
        if (voteStatus === 'up') {
          setVoteStatus('up');
          setUpvotes(upvotes);
        } else if (voteStatus === 'down') {
          setVoteStatus('down');
          setUpvotes(upvotes - 2);
        } else {
          setVoteStatus(null);
          setUpvotes(upvotes - 1);
        }
      }
    } catch (err) {
      console.error("Error during upvote:", err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownvote = async () => {
    if (isVoting) return;
    setIsVoting(true);
    
    // Optimistic UI update
    if (voteStatus === 'down') {
      setVoteStatus(null);
      setUpvotes(upvotes + 1);
    } else {
      setVoteStatus('down');
      setUpvotes(voteStatus === 'up' ? upvotes - 2 : upvotes - 1);
    }
    
    try {
      // Send vote to database
      const { success, error } = await voteOnPost(post.id, false);
      
      if (!success && error) {
        // Revert optimistic update if error occurs
        console.error("Failed to register downvote:", error);
        if (voteStatus === 'down') {
          setVoteStatus('down');
          setUpvotes(upvotes);
        } else if (voteStatus === 'up') {
          setVoteStatus('up'); 
          setUpvotes(upvotes + 2);
        } else {
          setVoteStatus(null);
          setUpvotes(upvotes + 1);
        }
      }
    } catch (err) {
      console.error("Error during downvote:", err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleCommentClick = () => {
    router.push(`/r/${post.subredditName}/${post.id}`);
  };

  return (
    <div className="bg-white dark:bg-[#121212] text-gray-900 dark:text-white px-4 py-2 rounded-lg mb-4">
      <div className="flex items-center mb-1 py-1">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Link href={`/r/${post.subredditName}`} className="font-medium">r/{post.subredditName}</Link>
          <span className="mx-1">•</span>
          <span>Posted by{" "}
            <Link href={`/u/${post.authorName}`} className="hover:underline">
              u/{post.authorName}
            </Link>
          </span>
          <span className="mx-1">•</span>
          <span>{post.timePosted}</span>
        </div>
      </div>
      
      <h1 className="text-xl font-medium mb-2">
        {post.title}
      </h1>
      
      <div className="text-gray-800 dark:text-gray-300 mb-3 whitespace-pre-wrap">
        {post.content}
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center bg-gray-100 dark:bg-[#272729] rounded-full px-2 py-1 mr-2">
          <button 
            className="p-0.5"
            onClick={handleUpvote}
            disabled={isVoting}
          >
            <ArrowUp 
              size={18} 
              className={`${isVoting ? 'opacity-50' : ''} ${voteStatus === 'up' 
                ? "text-orange-500" 
                : "text-gray-500"}`} 
            />
          </button>
          <span className="mx-1 text-sm font-medium">{upvotes}</span>
          <button 
            className="p-0.5"
            onClick={handleDownvote}
            disabled={isVoting}
          >
            <ArrowDown 
              size={18} 
              className={`${isVoting ? 'opacity-50' : ''} ${voteStatus === 'down' 
                ? "text-blue-500" 
                : "text-gray-500"}`} 
            />
          </button>
        </div>
        
        <button 
          className="flex items-center bg-gray-100 dark:bg-[#272729] rounded-full px-3 py-1 mr-2"
          onClick={handleCommentClick}
        >
          <MessageSquare size={16} className="mr-1 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{post.commentCount}</span>
        </button>
        
        <button className="flex items-center bg-gray-100 dark:bg-[#272729] rounded-full px-3 py-1 mr-2">
          <Award size={16} className="mr-1 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Award</span>
        </button>
        
        <button className="flex items-center bg-gray-100 dark:bg-[#272729] rounded-full px-3 py-1">
          <Share2 size={16} className="mr-1 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
