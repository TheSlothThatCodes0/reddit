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

/**
 * Fetches a specific post by ID
 */
export async function getPostById(postId: string): Promise<{
  post: Post | null;
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase.rpc('get_post_data', { 
      "postid": postId
    });
    
    if (error) {
      console.error("Error fetching post:", error);
      return { post: null, error: error.message };
    }
    
    if (!data || data.length === 0) {
      return { post: null, error: "Post not found" };
    }
    
    const post = data[0];
    
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
        contentText = post.content.text || '';
      }
    }
    
    const transformedPost: Post = {
      id: post.id,
      title: post.title || 'Untitled',
      content: contentText,
      upvotes: post.upvotes || 0,
      commentCount: post.commentcount || 0,
      subredditName: post.subredditname || 'unknown',
      authorName: post.authorname || 'anonymous',
      timePosted: post.timeposted ? formatDate(post.timeposted) : 'unknown date',
    };
    
    console.log("Transformed post:", transformedPost); // Debug
    
    return { post: transformedPost, error: null };
  } catch (err: any) {
    return { post: null, error: "Failed to load post. Please try again later." };
  }
}

/**
 * Fetches comments for a specific post
 */
export async function getPostComments(postId: string): Promise<{
  comments: Comment[];
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase.rpc('get_post_comments', { 
      input_post_id: postId 
    });
    
    if (error) {
      console.error("Error fetching comments:", error);
      return { comments: [], error: error.message };
    }

    console.log("Raw comments data:", data);
    
    // Transform the comments to match our Comment type
    const transformedComments = data.map((comment: any) => {
      return {
        id: comment.id,
        postId: comment.postid,
        content: typeof comment.content === 'object' ? comment.content.text || '' : comment.content,
        authorName: comment.authorname,
        upvotes: comment.upvotes || 0,
        timePosted: comment.timeposted ? formatDate(comment.timeposted) : 'unknown date',
        // Keep the original reply_to value regardless of whether it exists in current data
        // This is important because the comment might be replying to a comment that
        // exists in the database but wasn't fetched in this batch
        replyToId: comment.reply_to
      };
    });
    
    // For the view, treat comments with non-existent parent comments as top-level
    // This ensures all comments are displayed rather than filtered out
    console.log("Transformed comments:", transformedComments);
    
    return { comments: transformedComments, error: null };
  } catch (err: any) {
    console.error("Exception fetching comments:", err);
    return { comments: [], error: "Failed to load comments. Please try again later." };
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

/**
 * Creates a new comment on a post
 */
export async function createComment(
  postId: string, 
  content: string, 
  userId: number = 1 // Default for development
): Promise<{
  success: boolean;
  commentId?: string;
  error?: string;
}> {
  const supabase = getSupabaseClient();
  
  try {
    // Create the comment record
    const { data: commentData, error: commentError } = await supabase
      .from('comment')
      .insert({
        content: { text: content },
        "userID": userId,
        "postID": postId
      })
      .select()
      .single();
      
    if (commentError) {
      console.error("Error creating comment:", commentError);
      return { success: false, error: commentError.message };
    }
    
    console.log("Created comment:", commentData);
    
    return { 
      success: true,
      commentId: commentData.id
    };
    
  } catch (err: any) {
    console.error("Exception creating comment:", err);
    return { success: false, error: "Failed to create comment. Please try again." };
  }
}

/**
 * Creates a reply to another comment
 */
export async function createCommentReply(
  postId: string,
  parentCommentId: string,
  content: string,
  userId: number = 1 // Default for development
): Promise<{
  success: boolean;
  commentId?: string;
  error?: string;
}> {
  const supabase = getSupabaseClient();
  
  try {
    // Step 1: Create the reply comment
    const { data: commentData, error: commentError } = await supabase
      .from('comment')
      .insert({
        content: { text: content },
        "userID": userId,
        "postID": postId
      })
      .select()
      .single();
      
    if (commentError) {
      console.error("Error creating reply comment:", commentError);
      return { success: false, error: commentError.message };
    }
    
    const replyCommentId = commentData.id;
    
    // Step 2: Create the relationship in the replies table
    const { error: replyError } = await supabase
      .from('replies')
      .insert({
        id: parentCommentId,           // The comment being replied to
        replies_id: replyCommentId     // The reply comment
      });
      
    if (replyError) {
      console.error("Error creating reply relationship:", replyError);
      // Even though we couldn't create the relationship, we still created the comment
      // We could delete the comment here to maintain consistency, but for simplicity
      // we'll just return an error
      return { 
        success: false, 
        commentId: replyCommentId,
        error: "Comment created but couldn't link it as a reply. Please try again."
      };
    }
    
    console.log(`Created reply comment ${replyCommentId} to parent ${parentCommentId}`);
    
    return { 
      success: true,
      commentId: replyCommentId
    };
    
  } catch (err: any) {
    console.error("Exception creating comment reply:", err);
    return { success: false, error: "Failed to create reply. Please try again." };
  }
}

/**
 * Votes on a post (upvote or downvote)
 */
export async function voteOnPost(
  postId: string,
  isUpvote: boolean,
  userId: number = 1 // Default for development
): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = getSupabaseClient();
  
  try {
    // First check if the user has already voted on this post
    const { data: existingVote, error: checkError } = await supabase
      .from('vote')
      .select('*')
      .eq('userID', userId)
      .eq('postID', postId)
      .is('commentID', null)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking existing vote:", checkError);
      return { success: false, error: checkError.message };
    }
    
    // If the user already voted and is making the same vote type again, delete the vote (toggle off)
    if (existingVote && existingVote.isUpvote === isUpvote) {
      const { error: deleteError } = await supabase
        .from('vote')
        .delete()
        .eq('userID', userId)
        .eq('postID', postId)
        .is('commentID', null);
        
      if (deleteError) {
        console.error("Error removing vote:", deleteError);
        return { success: false, error: deleteError.message };
      }
      
      return { success: true };
    }
    
    // If user already voted but is changing vote type (upvote ↔ downvote)
    if (existingVote) {
      const { error: updateError } = await supabase
        .from('vote')
        .update({ isUpvote })
        .eq('userID', userId)
        .eq('postID', postId)
        .is('commentID', null);
        
      if (updateError) {
        console.error("Error updating vote:", updateError);
        return { success: false, error: updateError.message };
      }
      
      return { success: true };
    }
    
    // If no existing vote, insert a new one
    const { error: insertError } = await supabase
      .from('vote')
      .insert({
        userID: userId,
        postID: postId,
        commentID: null,
        isUpvote
      });
      
    if (insertError) {
      console.error("Error inserting vote:", insertError);
      return { success: false, error: insertError.message };
    }
    
    return { success: true };
    
  } catch (err: any) {
    console.error("Exception while voting on post:", err);
    return { success: false, error: "Failed to save vote. Please try again." };
  }
}

/**
 * Votes on a comment (upvote or downvote)
 */
export async function voteOnComment(
  commentId: string,
  isUpvote: boolean,
  userId: number = 1 // Default for development
): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = getSupabaseClient();
  
  try {
    // First check if the user has already voted on this comment
    const { data: existingVote, error: checkError } = await supabase
      .from('vote')
      .select('*')
      .eq('userID', userId)
      .eq('commentID', commentId)
      .is('postID', null)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking existing comment vote:", checkError);
      return { success: false, error: checkError.message };
    }
    
    // If the user already voted and is making the same vote type again, delete the vote (toggle off)
    if (existingVote && existingVote.isUpvote === isUpvote) {
      const { error: deleteError } = await supabase
        .from('vote')
        .delete()
        .eq('userID', userId)
        .eq('commentID', commentId)
        .is('postID', null);
        
      if (deleteError) {
        console.error("Error removing comment vote:", deleteError);
        return { success: false, error: deleteError.message };
      }
      
      return { success: true };
    }
    
    // If user already voted but is changing vote type (upvote ↔ downvote)
    if (existingVote) {
      const { error: updateError } = await supabase
        .from('vote')
        .update({ isUpvote })
        .eq('userID', userId)
        .eq('commentID', commentId)
        .is('postID', null);
        
      if (updateError) {
        console.error("Error updating comment vote:", updateError);
        return { success: false, error: updateError.message };
      }
      
      return { success: true };
    }
    
    // If no existing vote, insert a new one
    const { error: insertError } = await supabase
      .from('vote')
      .insert({
        userID: userId,
        postID: null,
        commentID: commentId,
        isUpvote
      });
      
    if (insertError) {
      console.error("Error inserting comment vote:", insertError);
      return { success: false, error: insertError.message };
    }
    
    return { success: true };
    
  } catch (err: any) {
    console.error("Exception while voting on comment:", err);
    return { success: false, error: "Failed to save vote. Please try again." };
  }
}

/**
 * Gets the current vote status for a post by the current user
 */
export async function getUserVoteOnPost(
  postId: string, 
  userId: number = 1
): Promise<{
  voteStatus: 'up' | 'down' | null;
  error?: string;
}> {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('vote')
      .select('isUpvote')
      .eq('userID', userId)
      .eq('postID', postId)
      .is('commentID', null)
      .maybeSingle();
      
    if (error) {
      return { voteStatus: null, error: error.message };
    }
    
    if (!data) {
      return { voteStatus: null }; // No vote found
    }
    
    return { voteStatus: data.isUpvote ? 'up' : 'down' };
    
  } catch (err: any) {
    console.error("Error getting user vote status:", err);
    return { voteStatus: null, error: "Failed to get vote status" };
  }
}

/**
 * Gets the current vote status for a comment by the current user
 */
export async function getUserVoteOnComment(
  commentId: string, 
  userId: number = 1
): Promise<{
  voteStatus: 'up' | 'down' | null;
  error?: string;
}> {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('vote')
      .select('isUpvote')
      .eq('userID', userId)
      .eq('commentID', commentId)
      .is('postID', null)
      .maybeSingle();
      
    if (error) {
      return { voteStatus: null, error: error.message };
    }
    
    if (!data) {
      return { voteStatus: null }; // No vote found
    }
    
    return { voteStatus: data.isUpvote ? 'up' : 'down' };
    
  } catch (err: any) {
    console.error("Error getting comment vote status:", err);
    return { voteStatus: null, error: "Failed to get vote status" };
  }
}

/**
 * Fetches communities (subreddits) the user has subscribed to
 */
export async function getUserSubscribedCommunities(
  userId: number = 1 // Default user ID for development
): Promise<{
  communities: Array<{ id: number; name: string }>;
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('subscription')
      .select(`
        subreddit:subredditID (
          "subredditID",
          "subredditName"
        )
      `)
      .eq('userID', userId)
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error("Error fetching subscriptions:", error);
      return { communities: [], error: error.message };
    }
    
    const communities = (data || []).map(item => ({
      id: item.subreddit.subredditID,
      name: item.subreddit.subredditName
    }));
    
    return { communities, error: null };
  } catch (err: any) {
    console.error("Exception fetching subscribed communities:", err);
    return { communities: [], error: "Failed to load your communities" };
  }
}

/**
 * Fetches popular communities based on subscription count
 */
export async function getPopularCommunities(limit: number = 8): Promise<{
  communities: Array<{ id: number; name: string; memberCount: number }>;
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  
  try {
    // Get communities ordered by subscription count
    const { data, error } = await supabase.rpc('get_popular_communities_with_count', { 
      p_limit: limit 
    });
    
    if (error) {
      console.error("Error fetching popular communities:", error);
      return { communities: [], error: error.message };
    }
    
    const communities = (data || []).map(item => ({
      id: item.subreddit_id,
      name: item.subreddit_name,
      memberCount: item.subscriber_count || 0
    }));
    
    return { communities, error: null };
  } catch (err: any) {
    console.error("Exception fetching popular communities:", err);
    return { communities: [], error: "Failed to load popular communities" };
  }
}

// Add more API functions as needed
