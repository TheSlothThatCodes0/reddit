/**
 * Comment type definition used throughout the application
 */
export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorName: string;
  upvotes: number;
  timePosted: string;
  replyToId?: string; // Optional for nested comments
}
