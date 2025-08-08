"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Profile Header Skeleton */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 text-center md:text-left">
                  <Skeleton className="h-8 w-48 mb-2 mx-auto md:mx-0" />
                  <Skeleton className="h-5 w-64 mb-4 mx-auto md:mx-0" />
                  <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personas Grid Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 1 }).map((_, i) => (
                  <Card key={i} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-6 rounded" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
