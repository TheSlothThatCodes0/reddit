import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import PopularCommunities from "@/components/PopularCommunities";

export default function TrendingPage() {
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <Feed feedType="trending" />
      <PopularCommunities />
    </div>
  );
}
