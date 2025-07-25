"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUp, ArrowDown, MessageSquare, Award, Share2 } from 'lucide-react';
import { Post as PostType } from '@/types/post';
import { voteOnPost, getUserVoteOnPost, getPostAwards, giveAward, AwardType } from '@/lib/supabase/api';
import AwardIcon from './AwardIcon';
import AwardSelector from './AwardSelector';

type PostDetailProps = {
  post: PostType;
};

const PostDetail = ({ post }: PostDetailProps) => {
  const router = useRouter();
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [isVoting, setIsVoting] = useState(false);
  const [isAwardSelectorOpen, setIsAwardSelectorOpen] = useState(false);
  const [awards, setAwards] = useState<AwardType[]>([]);
  const [isLoadingAwards, setIsLoadingAwards] = useState(false);

  // Fetch the user's current vote status when component mounts
  useEffect(() => {
    const fetchVoteStatus = async () => {
      const { voteStatus: currentVote } = await getUserVoteOnPost(post.id);
      setVoteStatus(currentVote);
    };
    
    fetchVoteStatus();
  }, [post.id]);
  
  // Load awards for the post
  useEffect(() => {
    const loadAwards = async () => {
      setIsLoadingAwards(true);
      const { awards: postAwards } = await getPostAwards(post.id);
      setAwards(postAwards);
      setIsLoadingAwards(false);
    };
    
    loadAwards();
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

  const handleShare = async () => {
    // Create the post URL
    const postUrl = `${window.location.origin}/r/${post.subredditName}/${post.id}`;
    
    // Check if the Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out this post on Reddit: ${post.title}`,
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

  const handleAwardClick = () => {
    setIsAwardSelectorOpen(true);
  };

  const handleAwardGiven = (awardType: AwardType) => {
    // Update the local state with the new award
    setAwards([...awards, awardType]);
  };

  return (
    <div className="bg-white dark:bg-[#121212] text-gray-900 dark:text-white px-4 py-2 rounded-lg mb-4">
      <div className="flex items-center mb-1 py-1">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Link href={`/r/${post.subredditName}`} className="font-medium">r/{post.subredditName}</Link>
          <span className="mx-1">•</span>
          <span>Posted by{" "}
            <Link href={`/user/${post.authorName}`} className="hover:underline">
              u/{post.authorName}
            </Link>
          </span>
          <span className="mx-1">•</span>
          <span>{post.timePosted}</span>
          
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
                
                {/* Show total award count */}
                {awards.length > 0 && (
                  <span className="text-xs text-gray-400 ml-1">{awards.length}</span>
                )}
              </div>
            </>
          )}
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
        
        <button 
          onClick={handleAwardClick}
          className="flex items-center bg-gray-100 dark:bg-[#272729] rounded-full px-3 py-1 mr-2 cursor-pointer"
        >
          <AwardIcon type="gold" size={16} className="mr-1" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {awards.length > 0 ? awards.length : 'Award'}
          </span>
        </button>
        
        <button 
          onClick={handleShare}
          className="flex items-center bg-gray-100 dark:bg-[#272729] rounded-full px-3 py-1 cursor-pointer"
        >
          <Share2 size={16} className="mr-1 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Share</span>
        </button>
      </div>
      
      {/* Award selector modal */}
      <AwardSelector
        postId={post.id}
        isOpen={isAwardSelectorOpen}
        onClose={() => setIsAwardSelectorOpen(false)}
        onAwardGiven={handleAwardGiven}
      />
    </div>
  );
};

export default PostDetail;
