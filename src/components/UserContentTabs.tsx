"use client";

import { useState } from 'react';
import Post from './Post';
import UserComment from './UserComment';
import { Post as PostType } from '@/types/post';
import { Comment } from '@/types/comment';

type UserContentTabsProps = {
  posts: PostType[];
  comments: Comment[];
  username: string;
};

const UserContentTabs = ({ posts, comments, username }: UserContentTabsProps) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');

  return (
    <div>
      {/* Tab navigation */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`inline-block p-4 border-b-2 ${
                activeTab === 'posts' 
                  ? 'text-blue-500 border-blue-500' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
            >
              Posts
            </button>
          </li>
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('comments')}
              className={`inline-block p-4 border-b-2 ${
                activeTab === 'comments' 
                  ? 'text-blue-500 border-blue-500' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
            >
              Comments
            </button>
          </li>
        </ul>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map(post => (
                <div className="w-full rounded-xl overflow-hidden" key={post.id}> 
                  <Post {...post} />
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500">u/{username} hasn't posted anything yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map(comment => (
                <UserComment key={comment.id} comment={comment} />
              ))
            ) : (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500">u/{username} hasn't commented on anything yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserContentTabs;
