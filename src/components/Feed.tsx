"use client";

import Post from './Post';
import { Post as PostType } from '@/types/post';

// Sample post data
const SAMPLE_POSTS = [
  {
    id: 'post1',
    title: "What's the most mind-blowing fact you've learned?",
    content: 'Share the facts that completely changed your perspective or understanding of something.',
    upvotes: 2453,
    commentCount: 342,
    subredditName: 'askreddit',
    authorName: 'curious_mind',
    timePosted: '5 hours ago'
  },
  {
    id: 'post2',
    title: 'New study shows promising results for renewable energy efficiency',
    content: 'Researchers have developed a new solar panel technology that improves energy capture by 37% compared to traditional panels.',
    upvotes: 1827,
    commentCount: 195,
    subredditName: 'science',
    authorName: 'green_tech',
    timePosted: '8 hours ago'
  },
  {
    id: 'post3',
    title: "What's your favorite underrated movie that deserves more attention?",
    content: "Looking for hidden gems to watch this weekend. What movies do you think are masterpieces but didn't get the recognition they deserve?",
    upvotes: 945,
    commentCount: 503,
    subredditName: 'movies',
    authorName: 'film_buff',
    timePosted: '12 hours ago'
  }
];

type FeedProps = {
  feedType?: 'forYou' | 'trending' | string;
  posts?: PostType[];
};

const Feed = ({ feedType = 'forYou', posts = SAMPLE_POSTS }: FeedProps) => {
  return (
    <div className="flex-1 overflow-x-hidden pb-8 pl-64 pr-72 pt-16">
      <div className="mx-auto max-w-2xl pt-4">
        <div className="flex flex-col space-y-4"> 
          {posts.length > 0 ? (
            posts.map((post) => (
              <div className="w-full rounded-xl overflow-hidden" key={post.id}> 
                <Post {...post} />
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500">No posts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
