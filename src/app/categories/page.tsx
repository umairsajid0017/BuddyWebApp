import { useCategories } from "@/apis/apiCalls";
import AllCategoriesComponent from "@/components/services/all-categories-component";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="mb-8 text-2xl font-bold">All Categories</h1> */}
      <AllCategoriesComponent />
    </div>
  );
}
