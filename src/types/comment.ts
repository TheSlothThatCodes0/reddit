export type Comment = {
  id: string;
  postId: string;
  content: string;
  authorName: string;
  upvotes: number;
  timePosted: string;
  replyToId: string | null;  // Make this a required field that can be null
};
