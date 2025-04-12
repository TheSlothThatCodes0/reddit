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
    <div className="flex min-h-screen bg-[#1a1a1b] text-[#d7dadc]">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden pb-8 pl-64 pr-72 pt-16">
        <div className="mx-auto max-w-3xl pt-4">
          {/* Community banner */}
          <div className="mb-4 rounded-md bg-zinc-900 p-4 shadow-sm">
            <div className="flex items-center">
              <div className="mr-3 h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-orange-500">
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                  r/{params.subreddit.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold">r/{params.subreddit}</h1>
                <p className="text-sm text-gray-400">r/{params.subreddit}</p>
              </div>
              <button className="ml-auto rounded-full bg-orange-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-600">
                Join
              </button>
            </div>
          </div>

          <PostDetail post={post} />
          <CommentSection comments={comments} postId={params.postID} />
        </div>
      </div>
      
      <div className="fixed right-0 top-16 w-72 p-4">
        <div className="space-y-4">
          {/* About Community */}
          <div className="rounded-md bg-zinc-900 p-4">
            <h2 className="mb-3 text-base font-medium">About Community</h2>
            <p className="mb-3 text-sm text-gray-400">
              Welcome to r/{params.subreddit}, a place to discuss everything related to {params.subreddit}.
            </p>
            <div className="mb-3 border-b border-zinc-800 pb-3">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium">Members</div>
                  <div className="text-sm">2.1m</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Online</div>
                  <div className="text-sm">4.2k</div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Created Jan 25, 2008
            </div>
          </div>
          
          {/* Community Rules */}
          <div className="rounded-md bg-zinc-900 p-4">
            <h2 className="mb-3 text-base font-medium">r/{params.subreddit} Rules</h2>
            <ol className="list-inside list-decimal space-y-2 text-sm">
              <li>Be respectful and civil</li>
              <li>No spam or self-promotion</li>
              <li>Use appropriate post flairs</li>
              <li>Follow Reddit content policy</li>
            </ol>
          </div>
          
          <PopularPosts />
        </div>
      </div>
    </div>
  );
}
