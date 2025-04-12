import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import PopularCommunities from "@/components/PopularCommunities";
import PageLayout from "@/components/layout/PageLayout";

export default function Home() {
  return (
    <PageLayout>
      <div className="flex w-full min-h-screen overflow-x-hidden">
        <Sidebar />
        <Feed />
        <PopularCommunities />
      </div>
    </PageLayout>
  );
}
