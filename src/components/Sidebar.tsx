"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Home, Flame, ChevronDown } from 'lucide-react';

const SUBREDDITS = [
  { name: 'AskReddit', id: 'askreddit' },
  { name: 'funny', id: 'funny' },
  { name: 'gaming', id: 'gaming' },
  { name: 'pics', id: 'pics' },
  { name: 'worldnews', id: 'worldnews' },
  { name: 'science', id: 'science' },
  { name: 'todayilearned', id: 'todayilearned' },
  { name: 'movies', id: 'movies' },
];

const Sidebar = () => {
  const [feedTab, setFeedTab] = useState<'popular' | 'forYou'>('popular');
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-700 sticky-sidebar">
      <div className="p-4">
        {/* Feed Tabs */}
        <div className="space-y-1 mb-6">
          <Link
            href="/feed/forYou"
            className={`w-full flex items-center px-3 py-2 rounded-md ${
              feedTab === 'forYou'
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setFeedTab('forYou')}
          >
            <Home size={20} className="mr-2" />
            <span>Home (For You)</span>
          </Link>
          <Link
            href="/feed/trending"
            className={`w-full flex items-center px-3 py-2 rounded-md ${
              feedTab === 'popular'
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setFeedTab('popular')}
          >
            <Flame size={20} className="mr-2" />
            <span>Popular</span>
          </Link>
        </div>

        {/* Communities section */}
        <div className="mt-6">
          <div 
            className="flex items-center justify-between mb-2 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">COMMUNITIES</h3>
            <ChevronDown 
              size={16} 
              className={`text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </div>
          
          {expanded && (
            <ul className="space-y-1">
              {SUBREDDITS.map((subreddit) => (
                <li key={subreddit.id}>
                  <Link
                    href={`/r/${subreddit.id}`}
                    className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="w-6 h-6 mr-2 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full flex items-center justify-center text-xs">
                      r/
                    </span>
                    {subreddit.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;