"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUp, ArrowDown, MessageSquare, Share2 } from 'lucide-react';
import { voteOnPost, getUserVoteOnPost } from '@/lib/supabase/api';

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
  upvotes: initialUpvotes,
  commentCount,
  subredditName,
  authorName,
  timePosted,
}: PostProps) => {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isVoting, setIsVoting] = useState(false);
  const router = useRouter();

  // Load initial vote status
  useEffect(() => {
    const loadVoteStatus = async () => {
      const { voteStatus } = await getUserVoteOnPost(id);
      setVoteStatus(voteStatus);
    };
    
    loadVoteStatus();
  }, [id]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to post detail
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
      const { success, error } = await voteOnPost(id, true);
      
      if (!success) {
        // Revert on failure
        setVoteStatus(prevStatus);
        setUpvotes(initialUpvotes);
        console.error("Vote failed:", error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownvote = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to post detail
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
      const { success, error } = await voteOnPost(id, false);
      
      if (!success) {
        // Revert on failure
        setVoteStatus(prevStatus);
        setUpvotes(initialUpvotes);
        console.error("Vote failed:", error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVoting(false);
    }
  };

  const handlePostClick = (e: React.MouseEvent) => {
    // Don't trigger navigation if clicking on vote buttons or comment/share buttons
    if ((e.target as Element).closest('button')) return;
    
    // Use Next.js router for cleaner navigation without page reload
    router.push(`/r/${subredditName}/${id}`);
  };

  return (
    <div 
      className="bg-[#121212] text-white rounded-2xl w-full cursor-pointer"
      onClick={handlePostClick}
    >
      <div className="px-4 py-3">
        <div className="flex items-center mb-1">
          <div className="flex items-center text-xs text-gray-400">
            <Link href={`/r/${subredditName}`} className="font-medium">r/{subredditName}</Link>
            <span className="mx-1">•</span>
            <span>{timePosted}</span>
          </div>
        </div>
        
        <Link href={`/r/${subredditName}/${id}`} className="block hover:opacity-90">
          <h3 className="text-xl font-medium mb-2">
            {title}
          </h3>
          
          <div className="text-gray-300 mb-3">
            {content.length > 200 ? `${content.substring(0, 200)}...` : content}
          </div>
        </Link>
        
        <div className="flex items-center">
          <div className="flex items-center bg-[#272729] rounded-full px-2 py-1 mr-2">
            <button 
              className="p-0.5"
              onClick={handleUpvote}
              disabled={isVoting}
            >
              <ArrowUp 
                size={18} 
                className={`${isVoting ? 'opacity-50' : ''} ${voteStatus === 'up' 
                  ? "text-orange-500 " 
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
                  ? "text-blue-500 " 
                  : "text-gray-500"}`} 
              />
            </button>
          </div>
          
          <button className="flex items-center bg-[#272729] rounded-full px-3 py-1 mr-2">
            <MessageSquare size={16} className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-400">{commentCount}</span>
          </button>
          
          <button className="flex items-center bg-[#272729] rounded-full px-3 py-1">
            <Share2 size={16} className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-400">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;