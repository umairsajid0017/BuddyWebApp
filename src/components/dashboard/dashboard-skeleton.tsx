import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen px-24 mx-8">
      <main className="flex-1 p-6">
        {/* Stats Section */}
        <section className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="col-span-1 p-6">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Search and Promo Section */}
        <section className="flex flex-col lg:flex-row gap-4 mt-6">
          <div className="flex-1 rounded-lg shadow p-8 flex flex-col justify-center">
            <div className="text-center">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-8 w-1/2 mx-auto mt-2" />
            </div>
            <div className="mt-4 w-full flex items-center justify-center">
              <Input disabled className="w-10/12 h-14" />
            </div>
          </div>
          <div className="lg:w-1/3 rounded-lg shadow p-0 flex flex-col justify-center">
            <Skeleton className="w-full h-full rounded-lg" style={{ aspectRatio: '16/9' }} />
          </div>
        </section>

        {/* Categories Section */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="grid grid-cols-8 gap-4 mt-4">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="p-4">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-4 w-20 mt-2 mx-auto" />
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Services Section */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex items-center mt-4 space-x-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-6 w-20" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="p-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <Skeleton className="h-3 w-full mt-2" />
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardSkeleton;