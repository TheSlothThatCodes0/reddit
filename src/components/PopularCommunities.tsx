"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPopularCommunities } from '@/lib/supabase/api';

type Community = {
  id: number;
  name: string;
  memberCount: number;
};

const PopularCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPopularCommunities = async () => {
      setIsLoading(true);
      const { communities, error } = await getPopularCommunities(5);
      
      if (error) {
        setError(error);
      } else {
        setCommunities(communities);
      }
      
      setIsLoading(false);
    };
    
    loadPopularCommunities();
  }, []);

  // Format member count (e.g., 1200 -> 1.2k)
  const formatMemberCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}m`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    } else {
      return count.toString();
    }
  };

  return (
    <aside className="w-80 fixed top-28 right-18 bottom-0 overflow-y-auto">
      <div className="p-4">
        <div className="bg-white dark:bg-[#121212] rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Popular Communities
            </h2>
          </div>
          <div className="p-2">
            {isLoading ? (
              // Loading skeleton
              [...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center w-full">
                    <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse mr-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="px-3 py-2 text-sm text-red-500">
                Failed to load communities
              </div>
            ) : communities.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No communities found
              </div>
            ) : (
              communities.map((community) => (
                <Link 
                  href={`/r/${community.name}`}
                  key={community.id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-orange-600 mr-2 flex items-center justify-center text-xs text-white">
                      r/
                    </div>
                    <span className="text-sm font-medium">{community.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatMemberCount(community.memberCount)} members</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PopularCommunities;
