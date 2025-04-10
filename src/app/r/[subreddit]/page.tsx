import { notFound } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import SubredditFeed from '@/components/SubredditFeed';
import SubredditHeader from '@/components/SubredditHeader';

// In a real app, these would come from an API
import { SAMPLE_POSTS } from '@/data/sample-posts';
import { SUBREDDIT_INFO } from '@/data/subreddit-info';

export default function SubredditPage({ params }: { params: { subreddit: string } }) {
  // Get the subreddit ID from the URL
  const subredditId = params.subreddit;
  
  // Find the subreddit info
  const subreddit = SUBREDDIT_INFO.find(sub => sub.id === subredditId);
  
  // If subreddit not found, show 404
  if (!subreddit) {
    notFound();
  }
  
  // Filter posts for this subreddit
  const subredditPosts = SAMPLE_POSTS.filter(post => post.subredditName.toLowerCase() === subredditId);

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden pb-8 pl-64 pt-16">
        <SubredditHeader subreddit={subreddit} />
        <div className="mx-auto max-w-5xl px-4 pt-4">
          <SubredditFeed posts={subredditPosts} subreddit={subreddit} />
        </div>
      </div>
    </div>
  );
}
