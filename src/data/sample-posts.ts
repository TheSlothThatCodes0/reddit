import { Post } from '@/types/post';

export const SAMPLE_POSTS: Post[] = [
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
    content: 'Researchers have developed a new solar panel technology that improves energy capture by 37% compared to traditional panels.\n\nThe technology works by utilizing a new type of photovoltaic cell that can capture light from a broader spectrum of wavelengths. Tests show it works particularly well in cloudy conditions where traditional panels struggle.\n\nThis could be a game-changer for regions with less direct sunlight, making renewable energy more viable in more places around the world.',
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
