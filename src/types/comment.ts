export type Comment = {
  id: string;
  postId: string;
  content: string;
  authorName: string;
  upvotes: number;
  timePosted: string;
  replies?: Comment[];
};
