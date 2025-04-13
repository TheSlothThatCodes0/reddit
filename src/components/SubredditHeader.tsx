"use client";

import { useState, useEffect } from 'react';
import { isSubscribed, subscribeToSubreddit, unsubscribeFromSubreddit } from '@/lib/supabase/api';
import { Bell } from 'lucide-react';
import type { SubredditInfo } from '@/types/subreddit';

type SubredditHeaderProps = {
  subreddit: SubredditInfo;
};

const SubredditHeader = ({ subreddit }: SubredditHeaderProps) => {
  const [isMember, setIsMember] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if the user is a member of this subreddit
  useEffect(() => {
    const checkMembership = async () => {
      if (!subreddit?.id) return;
      
      setIsLoading(true);
      try {
        const subredditId = Number(subreddit.id);
        const { isSubscribed: isSub, error } = await isSubscribed(subredditId);
        
        if (error) {
          console.error("Error checking membership:", error);
          setError("Failed to check membership status");
        } else {
          setIsMember(isSub);
        }
      } catch (err) {
        console.error("Exception in checking membership:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkMembership();
  }, [subreddit?.id]);

  const handleJoin = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const subredditId = Number(subreddit.id);
      
      if (isMember) {
        // Leave the community
        const { success, error } = await unsubscribeFromSubreddit(subredditId);
        
        if (success) {
          setIsMember(false);
        } else {
          setError(error || "Failed to leave community");
        }
      } else {
        // Join the community
        const { success, error } = await subscribeToSubreddit(subredditId);
        
        if (success) {
          setIsMember(true);
        } else {
          setError(error || "Failed to join community");
        }
      }
    } catch (err) {
      console.error("Error in join/leave action:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-sm mb-4">
      {/* Banner - made consistent with user profile banner */}
      <div 
        className="h-32 w-full bg-gradient-to-r from-blue-500 to-purple-600"
        style={subreddit.bannerColor ? { background: subreddit.bannerColor } : {}}
      />
      
      {/* Subreddit info - using similar positioning as user profile */}
      <div className="mx-auto max-w-4xl px-4 pb-4 relative">
        {/* Subreddit icon - positioned similarly to profile avatar */}
        <div className="absolute -top-16 left-4">
          <div className="w-32 h-32 rounded-full bg-blue-500 border-4 border-white dark:border-gray-800 flex items-center justify-center text-white text-4xl font-bold"
            style={{ background: getSubredditColor(subreddit.id) }}>
            {subreddit.name.charAt(0).toUpperCase()}
          </div>
        </div>
        
        {/* Subreddit details - with similar spacing */}
        <div className="flex items-center justify-between pl-40 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">r/{subreddit.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {subreddit.members} members • {subreddit.activeMembers || '1.2k'} online
            </p>
            {subreddit.description && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                {subreddit.description}
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <button 
              className="px-4 py-1 text-sm font-medium rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Bell size={18} className="inline mr-1" />
              Join
            </button>
            <button
              onClick={handleJoin}
              disabled={isLoading}
              className={`px-4 py-1 text-sm font-medium rounded-full ${
                isMember 
                  ? 'bg-transparent border border-white dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Loading...' : isMember ? 'Joined' : 'Join'}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-2 text-red-400 text-sm">{error}</div>
        )}
      </div>
    </div>
  );
};

// Helper function to get a consistent color for subreddits
function getSubredditColor(id: string): string {
  const colors = {
    'askreddit': '#FF4500',
    'funny': '#15AEEF',
    'gaming': '#1CB5E0',
    'pics': '#71B280',
    'science': '#4CA1AF',
    'worldnews': '#004e92',
    'todayilearned': '#D76D77',
    'movies': '#6f0000'
  };
  
  return colors[id as keyof typeof colors] || '#3B82F6';
}

export default SubredditHeader;
