"use client";

import Link from 'next/link';
import { Calendar, Users, Shield, Info } from 'lucide-react';
import { SubredditInfo } from '@/types/subreddit';
import { SUBREDDIT_INFO } from '@/data/subreddit-info';

type SubredditSidebarProps = {
  subreddit: SubredditInfo;
};

const SubredditSidebar = ({ subreddit }: SubredditSidebarProps) => {
  // Find similar subreddits (in a real app, this would come from an API)
  const similarSubreddits = SUBREDDIT_INFO
    .filter(s => s.id !== subreddit.id)
    .sort(() => 0.5 - Math.random()) // Random order
    .slice(0, 3); // Show just 3
  
  return (
    <div className="flex flex-col space-y-4 sticky top-20">
      {/* About Community */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 bg-blue-500 text-white font-medium">
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
        <div className="p-3 bg-blue-500 text-white font-medium">
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
      
      {/* Moderators */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 bg-blue-500 text-white font-medium">
          Moderators
        </div>
        <div className="p-2">
          <div className="space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center">
                <Shield size={14} className="mr-2 text-green-500" />
                <Link href="#" className="text-sm text-blue-500 hover:underline">
                  u/{`mod_${subreddit.name.toLowerCase()}_${i + 1}`}
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Link href="#" className="text-sm text-blue-500 hover:underline pl-2">
              View All Moderators
            </Link>
          </div>
        </div>
      </div>

      {/* Similar Communities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 bg-blue-500 text-white font-medium">
          Similar Communities
        </div>
        <div className="p-2">
          {similarSubreddits.map(sim => (
            <Link
              key={sim.id}
              href={`/r/${sim.id}`}
              className="flex items-center justify-between px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-white text-xs font-bold">
                  {sim.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">r/{sim.name}</span>
              </div>
              <span className="text-xs text-gray-500">{sim.members}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubredditSidebar;
