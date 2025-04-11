"use client";

import Link from 'next/link';
import { ArrowUp, ArrowDown, MessageSquare, Share2, Bookmark } from 'lucide-react';
import type { Post } from '@/types/post';
import { useState } from 'react';

type PostDetailProps = {
  post: Post;
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
    <div className="bg-[#121212] text-white rounded-lg shadow-sm mb-6">
      <div className="flex">
        {/* Vote column */}
        <div className="w-12 bg-[#1A1A1B] flex flex-col items-center py-4 rounded-l-lg">
          <button 
            className="vote-button" 
            onClick={handleUpvote}
          >
            <ArrowUp 
              size={20} 
              className={voteStatus === 'up' 
                ? "text-orange-500" 
                : "text-gray-500 hover:text-orange-500"} 
            />
          </button>
          <span className="text-xs font-medium my-1">{upvotes}</span>
          <button 
            className="vote-button" 
            onClick={handleDownvote}
          >
            <ArrowDown 
              size={20}
              className={voteStatus === 'down' 
                ? "text-blue-500" 
                : "text-gray-500 hover:text-blue-500"} 
            />
          </button>
        </div>
        
        {/* Post content */}
        <div className="flex-1 p-4">
          {/* Post header */}
          <div className="text-xs text-gray-400 mb-2">
            Posted by <Link href={`/user/${post.authorName}`} className="text-gray-400 hover:underline">u/{post.authorName}</Link> in <Link href={`/r/${post.subredditName}`} className="text-gray-400 hover:underline">r/{post.subredditName}</Link> • {post.timePosted}
          </div>
          
          {/* Post title */}
          <h1 className="text-xl font-semibold mb-3 text-white">
            {post.title}
          </h1>
          
          {/* Post content */}
          <div className="text-gray-300 mb-4 whitespace-pre-wrap">
            {post.content}
          </div>
          
          {/* Post actions */}
          <div className="flex text-gray-400 text-sm border-t border-[#272729] pt-3">
            <div className="flex items-center mr-6 hover:bg-[#272729] rounded px-2 py-1">
              <MessageSquare size={16} className="mr-1 text-gray-500" />
              <span>{post.commentCount} Comments</span>
            </div>
            
            <div className="flex items-center mr-6 hover:bg-[#272729] rounded px-2 py-1">
              <Share2 size={16} className="mr-1 text-gray-500" />
              <span>Share</span>
            </div>
            
            <div className="flex items-center hover:bg-[#272729] rounded px-2 py-1">
              <Bookmark size={16} className="mr-1 text-gray-500" />
              <span>Save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
