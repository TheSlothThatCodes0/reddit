"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PostDetail from '@/components/PostDetail';
import { getPostById, getPostComments } from '@/lib/supabase/api';
import type { Comment } from '@/types/comment'; // Use type import to avoid collision
import { Post } from '@/types/post';
import CommentSection from '@/components/CommentSection';
import PopularPosts from '@/components/PopularPosts';

interface PostPageProps {
  params: {
    subreddit: string;
    postID: string;
  }
}

export default function PostPage({ params }: PostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  // Explicitly define the Comment type to avoid collision with DOM's Comment type
  const [comments, setComments] = useState<Array<Comment>>([]);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [postError, setPostError] = useState<string | null>(null);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch post data
    const loadPost = async () => {
      setIsLoadingPost(true);
      const { post: postData, error } = await getPostById(params.postID);
      
      if (error || !postData) {
        setPostError(error || "Post not found");
      } else {
        console.log("Post data in page:", postData); // Debug
        setPost(postData);
      }
      
      setIsLoadingPost(false);
    };
    
    // Fetch comments
    const loadComments = async () => {
      setIsLoadingComments(true);
      const { comments: commentsData, error } = await getPostComments(params.postID);
      
      if (error) {
        setCommentsError(error);
      } else {
        // Cast to make sure we're using the correct Comment type
        setComments(commentsData as Array<Comment>);
      }
      
      setIsLoadingComments(false);
    };
    
    loadPost();
    loadComments();
  }, [params.postID]);

  // If post not found and done loading, show 404
  if (!post && !isLoadingPost && postError) {
    notFound();
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden pb-8 pl-64 pr-72 pt-16">
        <div className="mx-auto max-w-3xl pt-4">
          {isLoadingPost ? (
            <div className="w-full bg-[#121212] rounded-lg p-6 animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-32 bg-gray-700 rounded mb-4"></div>
            </div>
          ) : post ? (
            <PostDetail post={post} />
          ) : (
            <div className="w-full bg-[#121212] text-white rounded-lg p-6">
              <p className="text-red-500">Error loading post</p>
            </div>
          )}
          
          <CommentSection 
            comments={comments} 
            postId={params.postID} 
            isLoading={isLoadingComments}
            error={commentsError}
          />
        </div>
      </div>
      <PopularPosts />
    </div>
  );
}
