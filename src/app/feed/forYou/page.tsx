import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";

export default function ForYouPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">
        <Feed feedType="forYou" />
      </main>
    </div>
  );
}
