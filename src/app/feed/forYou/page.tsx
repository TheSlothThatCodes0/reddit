import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import PopularCommunities from "@/components/PopularCommunities";

export default function ForYouPage() {
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <Feed feedType="forYou" />
      <PopularCommunities />
    </div>
  );
}
