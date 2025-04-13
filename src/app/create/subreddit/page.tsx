"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { createSubreddit } from '@/lib/supabase/api';

export default function CreateSubredditPage() {
  const router = useRouter();
  const [subredditName, setSubredditName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!subredditName.trim()) {
      setError("Community name is required");
      return;
    }
    
    // Check if name is valid (only alphanumeric and underscores)
    const nameRegex = /^[a-zA-Z0-9_]+$/;
    if (!nameRegex.test(subredditName)) {
      setError("Community name can only contain letters, numbers, and underscores");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { success, subreddit, error } = await createSubreddit(
        subredditName.trim(),
        description.trim(),
        isPrivate
      );
      
      if (success && subreddit) {
        // Redirect to the new subreddit
        router.push(`/r/${subreddit.name}`);
      } else {
        setError(error || "Failed to create community. Please try again.");
      }
    } catch (err) {
      console.error("Error creating subreddit:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden pb-8 pl-64 pt-16">
        <div className="mx-auto max-w-3xl px-4 pt-8">
          <h1 className="text-2xl font-semibold mb-6">Create a community</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <div className="flex items-center">
                <span className="bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-3 text-gray-500">
                  r/
                </span>
                <input
                  type="text"
                  placeholder="community_name"
                  value={subredditName}
                  onChange={(e) => setSubredditName(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-r-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  maxLength={21}
                />
              </div>
              <div className="mt-1 text-xs text-right text-gray-500">
                {subredditName.length}/21
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Community names cannot be changed once created.
              </p>
            </div>
            
            {/* Description input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                placeholder="Describe your community..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                maxLength={500}
              />
              <div className="mt-1 text-xs text-right text-gray-500">
                {description.length}/500
              </div>
            </div>
            
            {/* Community type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Community type
              </label>
              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    type="radio"
                    id="public"
                    name="communityType"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                    className="mt-1 mr-2"
                  />
                  <div>
                    <label htmlFor="public" className="font-medium">Public</label>
                    <p className="text-sm text-gray-500">Anyone can view, post, and comment</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <input
                    type="radio"
                    id="private"
                    name="communityType"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                    className="mt-1 mr-2"
                  />
                  <div>
                    <label htmlFor="private" className="font-medium">Private</label>
                    <p className="text-sm text-gray-500">Only approved users can view and submit</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Error display */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-md text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            
            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !subredditName.trim()}
                className={`px-6 py-2 bg-blue-500 text-white rounded-full font-medium ${
                  isSubmitting || !subredditName.trim() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-blue-600'
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Community'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
