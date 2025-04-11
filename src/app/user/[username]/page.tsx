import { notFound } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import UserProfileHeader from '@/components/UserProfileHeader';
import UserContentTabs from '@/components/UserContentTabs';

import { USER_PROFILES } from '@/data/user-profiles';
import { SAMPLE_POSTS } from '@/data/sample-posts';
import { SAMPLE_COMMENTS } from '@/data/sample-comments';

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const username = params.username;
  
  // Find user profile
  const userProfile = USER_PROFILES.find(user => user.username.toLowerCase() === username.toLowerCase());
  
  // If user not found, show 404
  if (!userProfile) {
    notFound();
  }
  
  // Filter posts by this user
  const userPosts = SAMPLE_POSTS.filter(
    post => post.authorName.toLowerCase() === username.toLowerCase()
  );
  
  // Filter comments by this user
  const userComments = SAMPLE_COMMENTS.filter(
    comment => comment.authorName.toLowerCase() === username.toLowerCase()
  );

  // Check if this is the logged in user (for demo, we'll pretend "curious_mind" is logged in)
  const isCurrentUser = username.toLowerCase() === 'curious_mind';

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden pb-8 pl-64 pt-16">
        <UserProfileHeader 
          user={userProfile} 
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
