"use client";

import { useCallback } from 'react';
import { Bell } from 'lucide-react';
import type { SubredditInfo } from '@/types/subreddit';

type SubredditHeaderProps = {
  subreddit: SubredditInfo;
};

const SubredditHeader = ({ subreddit }: SubredditHeaderProps) => {
  const handleJoin = useCallback(() => {
    // In a real app, this would call an API to join the subreddit
    alert(`Joined r/${subreddit.name}`);
  }, [subreddit.name]);

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-sm mb-4">
      {/* Banner image */}
      <div 
        className="h-20 md:h-32 w-full bg-gradient-to-r from-blue-500 to-purple-600"
        style={subreddit.bannerColor ? { background: subreddit.bannerColor } : {}}
      />
      
      {/* Subreddit info */}
      <div className="mx-auto max-w-3xl px-4 pb-3 pt-4 relative">
        {/* Subreddit icon */}
        <div className="flex items-end absolute -top-6">
          <div className="w-16 h-16 rounded-full bg-blue-500 border-4 border-white dark:border-gray-800 flex items-center justify-center text-white text-2xl font-bold">
            {subreddit.name.charAt(0).toUpperCase()}
          </div>
        </div>
        
        {/* Subreddit details */}
        <div className="ml-20">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">r/{subreddit.name}</h1>
            <div className="flex space-x-3">
              <button 
                className="px-4 py-1 text-sm font-medium rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Bell size={18} className="inline mr-1" />
                Join
              </button>
              <button 
                onClick={handleJoin}
                className="px-4 py-1 text-sm font-medium rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Join
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {subreddit.members} members • {subreddit.activeMembers || '1.2k'} online
          </p>
          {subreddit.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
              {subreddit.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubredditHeader;
