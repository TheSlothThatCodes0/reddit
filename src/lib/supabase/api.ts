import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseFeedPost, Post } from "@/types/post";

// Create a shared Supabase client
const getSupabaseClient = () => createClientComponentClient();

/**
 * Fetches the personalized feed for a user
 */
export async function getForYouFeed(userId: number = 1): Promise<{
  posts: Post[];
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase.rpc('get_for_you_feed', { user_id: userId });
    
    if (error) {
      return { posts: [], error: error.message };
    }
    
    if (!data || data.length === 0) {
      return { posts: [], error: "No posts found in your feed" };
    }
    
    // Transform with proper field name mapping
    const transformedPosts: Post[] = (data as any[]).map(post => {
      // Extract content safely
      let contentText = '';
      if (post.content) {
        if (typeof post.content === 'string') {
          try {
            const parsed = JSON.parse(post.content);
            contentText = parsed.text || '';
          } catch {
            contentText = post.content;
          }
        } else if (typeof post.content === 'object') {
          contentText = post.content.text || JSON.stringify(post.content);
        }
      }
      
      return {
        id: post.id,
        title: post.title || 'Untitled',
        content: contentText,
        upvotes: post.vote_score || 0,
        commentCount: post.comment_count || 0,
        subredditName: post.subreddit_name || 'unknown',
        authorName: post.author_name || 'anonymous',
        timePosted: post.createdat ? formatDate(post.createdat) : 'unknown date',
      };
    });
    
    return { posts: transformedPosts, error: null };
  } catch (err: any) {
    return { posts: [], error: "Failed to load feed. Please try again later." };
  }
}

/**
 * Fetches trending posts
 */
export async function getTrendingPosts(userId: number = 1, limit: number = 50): Promise<{
  posts: Post[];
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase.rpc('get_trending_posts', { 
      p_user_id: userId,
      p_limit: limit 
    });
    
    if (error) {
      return { posts: [], error: error.message };
    }
    
    if (!data || data.length === 0) {
      return { posts: [], error: "No trending posts found" };
    }
    
    const transformedPosts: Post[] = (data as any[]).map(post => {
      // Extract content safely
      let contentText = '';
      if (post.content) {
        if (typeof post.content === 'string') {
          try {
            const parsed = JSON.parse(post.content);
            contentText = parsed.text || '';
          } catch {
            contentText = post.content;
          }
        } else if (typeof post.content === 'object') {
          contentText = post.content.text || JSON.stringify(post.content);
        }
      }
      
      return {
        id: post.id,
        title: post.title || 'Untitled',
        content: contentText,
        upvotes: post.vote_score || 0,
        commentCount: post.comment_count || 0,
        subredditName: post.subreddit_name || 'unknown',
        authorName: post.author_name || 'anonymous',
        timePosted: post.createdat ? formatDate(post.createdat) : 'unknown date',
        trendingScore: post.trending_score
      };
    });
    
    return { posts: transformedPosts, error: null };
  } catch (err: any) {
    return { posts: [], error: "Failed to load trending posts. Please try again later." };
  }
}

/**
 * Fetches posts for a specific subreddit
 */
export async function getSubredditPosts(subredditId: number): Promise<{
  posts: Post[];
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  
  try {
    // Example query for subreddit posts
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        "createdAt",
        users!inner(username),
        subreddit!inner(*)
      `)
      .eq('subredditID', subredditId)
      .order('createdAt', { ascending: false });
      
    if (error) {
      return { posts: [], error: error.message };
    }
    
    // Transform as needed
    // This would depend on the exact return structure
    const transformedPosts: Post[] = [];
    
    return { posts: transformedPosts, error: null };
  } catch (err: any) {
    return { posts: [], error: "Failed to load subreddit posts. Please try again later." };
  }
}

// Helper function to format dates consistently
function formatDate(dateString: string): string {
  try {
    // Try different date parsing approaches
    const date = new Date(dateString);
    
    // Check if valid date
    if (isNaN(date.getTime())) {
      return "unknown date";
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return "unknown date";
  }
}

// Add more API functions as needed
