"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUp, ArrowDown, MessageSquare, Share2 } from 'lucide-react';

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
    <div className="bg-[#121212] text-white rounded-2xl w-full">
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
            >
              <ArrowUp 
                size={18} 
                className={voteStatus === 'up' 
                  ? "text-orange-500 " 
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
                  ? "text-blue-500 " 
                  : "text-gray-500"} 
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