import { notFound } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PostDetail from '@/components/PostDetail';
import CommentSection from '@/components/CommentSection';
import PopularPosts from '@/components/PopularPosts';

// In a real app, this would fetch from an API
import { SAMPLE_POSTS } from '@/data/sample-posts';
import { SAMPLE_COMMENTS } from '@/data/sample-comments';

export default function PostPage({ params }: { params: { subreddit: string; postID: string } }) {
  // Find the post based on ID
  const post = SAMPLE_POSTS.find(post => post.id === params.postID);
  
  // If post not found, show 404
  if (!post) {
    notFound();
  }
  
  // Get comments for this post
  const comments = SAMPLE_COMMENTS.filter(comment => comment.postId === params.postID);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#030303] text-white">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden pb-8 pl-64 pr-72 pt-16">
        <div className="mx-auto max-w-3xl pt-4">
          <PostDetail post={post} />
          <CommentSection comments={comments} postId={params.postID} />
        </div>
      </div>
      <PopularPosts />
    </div>
  );
}
