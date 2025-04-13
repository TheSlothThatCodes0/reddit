"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUp, ArrowDown, MessageSquare, Share2 } from 'lucide-react';
import { voteOnPost, getUserVoteOnPost } from '@/lib/supabase/api';
import AwardIcon from './AwardIcon';
import AwardSelector from './AwardSelector';

type AwardType = 'bronze' | 'silver' | 'gold' | 'diamond';

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
  const [isAwardSelectorOpen, setIsAwardSelectorOpen] = useState(false);
  // Mock state for awards - in a real app, these would come from an API
  const [awards, setAwards] = useState<AwardType[]>([]);
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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to post detail
    
    // Create the post URL
    const postUrl = `${window.location.origin}/r/${subredditName}/${id}`;
    
    // Check if the Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this post on Reddit: ${title}`,
          url: postUrl,
        });
        console.log('Post shared successfully');
      } catch (err) {
        // User might have canceled the share operation
        console.log('Share was canceled or failed:', err);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      // Copy the link to clipboard
      try {
        await navigator.clipboard.writeText(postUrl);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
        alert('Could not copy link. Please copy it manually: ' + postUrl);
      }
    }
  };

  const handleAwardClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to post detail
    setIsAwardSelectorOpen(true);
  };

  const handleAwardGiven = (awardType: AwardType) => {
    // In a real app, this would call an API and then refresh the awards
    // For now, we'll just update the local state
    setAwards([...awards, awardType]);
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
            
            {/* Display awards if there are any */}
            {awards.length > 0 && (
              <>
                <span className="mx-1">•</span>
                <div className="flex items-center ml-1">
                  {/* Show up to 3 different award types */}
                  {Array.from(new Set(awards)).slice(0, 3).map((type, index) => (
                    <AwardIcon 
                      key={`${type}-${index}`} 
                      type={type} 
                      size={14} 
                      className="mx-0.5" 
                    />
                  ))}
                  
                  {/* If there are more than 3 award types, show a count */}
                  {new Set(awards).size > 3 && (
                    <span className="text-xs text-gray-400 ml-1">+{new Set(awards).size - 3}</span>
                  )}
                </div>
              </>
            )}
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
          
          <button 
            onClick={handleAwardClick}
            className="flex items-center bg-[#272729] rounded-full px-3 py-1 mr-2 cursor-pointer"
          >
            <AwardIcon type="gold" size={16} className="mr-1" />
            <span className="text-sm text-gray-400">
              {awards.length > 0 ? awards.length : 'Award'}
            </span>
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center bg-[#272729] rounded-full px-3 py-1 cursor-pointer"
          >
            <Share2 size={16} className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-400">Share</span>
          </button>
        </div>
      </div>
      
      {/* Award selector modal */}
      <AwardSelector
        postId={id}
        isOpen={isAwardSelectorOpen}
        onClose={() => setIsAwardSelectorOpen(false)}
        onAwardGiven={handleAwardGiven}
      />
    </div>
  );
};

export default Post;