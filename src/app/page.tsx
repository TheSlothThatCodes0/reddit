import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import PopularCommunities from "@/components/PopularCommunities";

export default function Home() {
  return (
    <div className="flex w-full min-h-screen overflow-x-hidden">
      <Sidebar />
      <Feed />
      <PopularCommunities />
    </div>
  );
}
