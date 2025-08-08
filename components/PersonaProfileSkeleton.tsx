"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
    />
  );
}

export default function PersonaProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Shimmer className="h-4 w-4 rounded-full" />
            <Shimmer className="h-4 w-24 rounded" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header Skeleton */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Shimmer className="h-32 w-32 rounded-full" />

                <div className="flex-1 text-center md:text-left space-y-4">
                  <Shimmer className="h-8 w-48 rounded" />
                  <Shimmer className="h-4 w-72 rounded" />

                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <Shimmer className="h-6 w-24 rounded" />
                    <Shimmer className="h-6 w-28 rounded" />
                    <Shimmer className="h-6 w-36 rounded" />
                  </div>

                  <Shimmer className="h-10 w-40 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions & Answers Skeleton */}
          <Card>
            <CardHeader>
              <Shimmer className="h-6 w-48 rounded" />
              <Shimmer className="h-4 w-72 rounded mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className="space-y-4">
                    <Shimmer className="h-16 w-full rounded-lg" />
                    <Shimmer className="h-20 w-full rounded-lg" />
                  </div>
                  {i === 1 && <Separator className="my-6" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
