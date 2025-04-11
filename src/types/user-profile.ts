export type UserProfile = {
  username: string;
  displayName?: string;
  avatarUrl?: string;
  avatarColor?: string;
  bannerColor?: string;
  bio?: string;
  karma: number;
  joinDate: string;
  location?: string;
  isVerified?: boolean;
};
