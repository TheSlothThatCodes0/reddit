"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUp, ArrowDown, MessageSquare, Award, Share2, MoreHorizontal } from 'lucide-react';
import { Post as PostType } from '@/types/post';

type PostDetailProps = {
  post: PostType;
};

const PostDetail = ({ post }: PostDetailProps) => {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(post.upvotes);

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
    <div className="bg-white dark:bg-[#121212] text-gray-900 dark:text-white px-4 py-2 rounded-lg mb-4">
      <div className="flex items-center mb-1 py-1">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Link href={`/r/${post.subredditName}`} className="font-medium">r/{post.subredditName}</Link>
          <span className="mx-1">•</span>
          <span>Posted by{" "}
            <Link href={`/u/${post.username}`} className="hover:underline">
              u/{post.username}
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
          >
            <ArrowUp 
              size={18} 
              className={voteStatus === 'up' 
                ? "text-orange-500" 
                : "text-gray-500"} 
            />
          </button>
          <span className="mx-1 text-sm font-medium">{upvotes}</span>
          <button 
            className="p-0.5"
            onClick={handleDownvote}
          >
            <ArrowDown 
              size={18} 
              className={voteStatus === 'down' 
                ? "text-blue-500" 
                : "text-gray-500"} 
            />
          </button>
        </div>
        
        <button className="flex items-center bg-gray-100 dark:bg-[#272729] rounded-full px-3 py-1 mr-2">
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
