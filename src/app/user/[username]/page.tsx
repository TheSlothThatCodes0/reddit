
"use client";

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import UserProfileHeader from '@/components/UserProfileHeader';
import UserContentTabs from '@/components/UserContentTabs';
import { getUserProfileByUsername, getUserPosts, getUserComments } from '@/lib/supabase/api';
import { UserProfile } from '@/types/user-profile';
import { Post } from '@/types/post';

interface UserProfilePageProps {
  params: {
    username: string;
  }
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const username = params.username;
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if this is the logged in user (for demo, we'll pretend "curious_mind" is logged in)
  // In a real app, you would get this from an auth context
  const isCurrentUser = username.toLowerCase() === 'QuirkyPanda42';
  
  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      
      // Fetch user profile
      const { user, error: profileError } = await getUserProfileByUsername(username);
      
      if (profileError || !user) {
        setError(profileError || "User not found");
        setLoading(false);
        return;
      }
      
      setUserProfile(user);
      
      // Fetch user posts
      const { posts, error: postsError } = await getUserPosts(username);
      if (!postsError) {
        setUserPosts(posts);
      }
      
      // Fetch user comments
      const { comments, error: commentsError } = await getUserComments(username);
      if (!commentsError) {
        setUserComments(comments);
      }
      
      setLoading(false);
    }
    
    fetchUserData();
  }, [username]);
  
  // Show 404 if user not found after loading
  if (!loading && (error || !userProfile)) {
    notFound();
  }
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen overflow-x-hidden">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden pb-8 pl-64 pt-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="text-lg text-gray-500">Loading user profile...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden pb-8 pl-64 pt-16">
        <UserProfileHeader 
          user={userProfile!} 
          isCurrentUser={isCurrentUser}
        />
        <div className="mx-auto max-w-4xl px-4">
          <UserContentTabs 
            posts={userPosts}
            comments={userComments}
            username={username}
          />
        </div>
      </div>
    </div>
  );
}
