export type Post = {
  id: string; // UUID stored as string in JS
  title: string;
  content: string;
  upvotes: number;
  commentCount: number;
  subredditName: string;
  authorName: string;
  timePosted: string;
  trendingScore?: number; // Optional trending score
  // Add any other fields needed by your application
};

// Type that matches the SQL function return from Supabase
export type SupabaseFeedPost = {
  id: string;                // UUID
  title: string;             // text
  content: { text?: string; [key: string]: any }; // JSON
  createdat: string;         // timestamp with time zone (lowercase)
  userid: number;            // bigint
  subredditid: number;       // bigint
  vote_score: number;        // integer (explicitly cast)
  is_subscribed: number;     // integer (0 or 1)
  comment_count: number;     // integer (explicitly cast)
  subreddit_name: string;    // text (explicitly cast)
  author_name: string;       // text (explicitly cast)
  trending_score: number;    // Added trending score field
};
