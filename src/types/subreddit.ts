export type SubredditInfo = {
  id: string | number; // Allow both string and number types for ID
  name: string;
  members: string;
  activeMembers?: string;
  description?: string;
  bannerColor?: string;
  createdAt?: string;
};
