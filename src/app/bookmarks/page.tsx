"use client";
import { useShowBookmarks } from "@/apis/apiCalls";
import Main from "@/components/ui/main";
import ServiceCard from "@/components/services/services-card";
export default function BookmarksPage() {
    const showBookmarks = useShowBookmarks();
    const { data: bookmarks } = showBookmarks;
    console.log("Bookmarks", bookmarks);
    if (!bookmarks) return <div>No bookmarks found</div>;




  return (
  <Main>
    <h1 className="text-2xl text-text font-bold my-4">Bookmarks</h1>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks?.records.map((bookmark) => (
        <ServiceCard key={bookmark.id} service={bookmark.service} />
      ))}
    </div>
  </Main>
  );
}
