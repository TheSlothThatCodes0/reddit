"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { searchSubreddits, createPost } from '@/lib/supabase/api';

type SubredditOption = {
  id: number;
  name: string;
  description: string | null;
  memberCount: number;
};

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subredditSearch, setSubredditSearch] = useState('');
  const [subredditResults, setSubredditResults] = useState<SubredditOption[]>([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState<SubredditOption | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  // Search for subreddits as user types
  useEffect(() => {
    const fetchSubreddits = async () => {
      if (subredditSearch.trim() === '') {
        // Don't clear results immediately to allow selection
        return;
      }
      
      setIsSearching(true);
      const { subreddits, error } = await searchSubreddits(subredditSearch);
      
      if (error) {
        console.error("Error searching subreddits:", error);
      } else {
        setSubredditResults(subreddits);
      }
      
      setIsSearching(false);
    };
    
    const timeoutId = setTimeout(fetchSubreddits, 300);
    return () => clearTimeout(timeoutId);
  }, [subredditSearch]);

  // Fetch initial suggestions on page load
  useEffect(() => {
    const fetchInitialSuggestions = async () => {
      setIsSearching(true);
      const { subreddits } = await searchSubreddits('');
      setSubredditResults(subreddits);
      setIsSearching(false);
    };
    
    fetchInitialSuggestions();
  }, []);

  const handleSubredditSelect = (subreddit: SubredditOption) => {
    setSelectedSubreddit(subreddit);
    setSubredditSearch(subreddit.name);
    setSearchFocused(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    if (!selectedSubreddit) {
      setError("Please select a subreddit");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { success, postId, error } = await createPost(
        title.trim(),
        content.trim(),
        selectedSubreddit.id
      );
      
      if (success && postId) {
        // Redirect to the new post
        router.push(`/r/${selectedSubreddit.name}/${postId}`);
      } else {
        setError(error || "Failed to create post. Please try again.");
      }
    } catch (err) {
      console.error("Error creating post:", err);
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
          <h1 className="text-2xl font-semibold mb-6">Create a post</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subreddit selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Choose a community
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a subreddit"
                  value={subredditSearch}
                  onChange={(e) => setSubredditSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
                
                {searchFocused && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200 dark:border-gray-700">
                    {isSearching ? (
                      <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                        Searching...
                      </div>
                    ) : subredditResults.length > 0 ? (
                      subredditResults.map(subreddit => (
                        <div
                          key={subreddit.id}
                          onClick={() => handleSubredditSelect(subreddit)}
                          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium">r/{subreddit.name}</div>
                            {subreddit.description && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {subreddit.description}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {subreddit.memberCount.toLocaleString()} members
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                        No communities found
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {selectedSubreddit && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-between">
                  <span className="font-medium">Selected: r/{selectedSubreddit.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubreddit(null);
                      setSubredditSearch('');
                    }}
                    className="text-sm text-red-500 dark:text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            
            {/* Title input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                maxLength={300}
              />
              <div className="mt-1 text-xs text-right text-gray-500">
                {title.length}/300
              </div>
            </div>
            
            {/* Content input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Text (optional)
              </label>
              <textarea
                placeholder="Text (optional)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
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
                disabled={isSubmitting || !title.trim() || !selectedSubreddit}
                className={`px-6 py-2 bg-blue-500 text-white rounded-full font-medium ${
                  isSubmitting || !title.trim() || !selectedSubreddit 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-blue-600'
                }`}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
