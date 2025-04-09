"use client";

import Post from './Post';

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
    title: 'What\'s your favorite underrated movie that deserves more attention?',
    content: 'Looking for hidden gems to watch this weekend. What movies do you think are masterpieces but didn\'t get the recognition they deserve?',
    upvotes: 945,
    commentCount: 503,
    subredditName: 'movies',
    authorName: 'film_buff',
    timePosted: '12 hours ago'
  }
];

type FeedProps = {
  feedType?: 'forYou' | 'trending';
};

const Feed = ({ feedType = 'forYou' }: FeedProps) => {
  return (
    <div className="w-full flex flex-col items-center pt-4 pb-8 px-4">
      <div className="w-full max-w-[60%] mx-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          {feedType === 'forYou' ? 'For You' : 'Trending'}
        </h2>

        <div className="flex flex-col items-center space-y-8"> 
          {SAMPLE_POSTS.map((post) => (
            <div className="w-full rounded-xl overflow-hidden" key={post.id}> 
              <Post {...post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;