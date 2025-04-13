"use client";

import Link from 'next/link';
import { Calendar, Users } from 'lucide-react';
import { SubredditInfo } from '@/types/subreddit';

type SubredditSidebarProps = {
  subreddit: SubredditInfo;
};

const SubredditSidebar = ({ subreddit }: SubredditSidebarProps) => {
  return (
    <div className="flex flex-col space-y-4 sticky top-20">
      {/* About Community */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 bg-zinc-900 text-white font-medium">
          About r/{subreddit.name}
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            {subreddit.description || `A community dedicated to ${subreddit.name} content and discussions.`}
          </p>
          <div className="flex items-center mb-3 text-sm">
            <Calendar size={16} className="mr-2 text-gray-500" />
            <span>Created {subreddit.createdAt || 'January 2008'}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users size={16} className="mr-2 text-gray-500" />
            <span>{subreddit.members} members</span>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 bg-zinc-900 text-white font-medium">
          r/{subreddit.name} Rules
        </div>
        <div className="p-2">
          <ol className="list-decimal list-inside text-sm space-y-2 pl-2 pr-1 py-1">
            <li className="text-gray-800 dark:text-gray-200">Be respectful and civil</li>
            <li className="text-gray-800 dark:text-gray-200">No spam or self-promotion</li>
            <li className="text-gray-800 dark:text-gray-200">Post must be on-topic</li>
            <li className="text-gray-800 dark:text-gray-200">No personal information</li>
            <li className="text-gray-800 dark:text-gray-200">Follow Reddit's content policy</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SubredditSidebar;
