"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Flame, ChevronDown } from 'lucide-react';
import { getUserSubscribedCommunities, getPopularCommunities } from '@/lib/supabase/api';

type Community = {
  id: number;
  name: string;
};

const Sidebar = () => {
  const [feedTab, setFeedTab] = useState<'popular' | 'forYou'>('popular');
  const [expanded, setExpanded] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCommunities = async () => {
      setIsLoading(true);
      
      // First try to get user subscribed communities
      const userCommunitiesResult = await getUserSubscribedCommunities();
      
      // If user has subscriptions, use those
      if (userCommunitiesResult.communities.length > 0) {
        setCommunities(userCommunitiesResult.communities);
        setError(null);
      } else {
        // If no user subscriptions, fall back to popular communities
        const popularCommunitiesResult = await getPopularCommunities();
        setCommunities(popularCommunitiesResult.communities);
        setError(popularCommunitiesResult.error);
      }
      
      setIsLoading(false);
    };
    
    loadCommunities();
  }, []);

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-700 fixed top-16 left-0 bottom-0 overflow-y-auto">
      <div className="p-4">
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
              {isLoading ? (
                <li className="px-3 py-2 text-sm">
                  <div className="animate-pulse flex space-x-2">
                    <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-8 w-8"></div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded my-3 w-24"></div>
                  </div>
                </li>
              ) : error ? (
                <li className="px-3 py-2 text-sm text-red-500 dark:text-red-400">
                  Failed to load communities
                </li>
              ) : communities.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-500">
                  No communities available
                </li>
              ) : (
                communities.map((community) => (
                  <li key={community.id}>
                    <Link
                      href={`/r/${community.name}`}
                      className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <span className="w-8 h-8 mr-2 bg-gradient-to-br from-red-300 to-orange-700 text-white rounded-full flex items-center justify-center text-xs">
                        r/
                      </span>
                      {community.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;