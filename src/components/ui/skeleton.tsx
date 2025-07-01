import * as React from "react"

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-100", className)}
      {...props}
    />
  )
}

// Entity List Skeleton
function EntityListSkeleton() {
  return (
    <div className="space-y-1 px-3 py-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 px-3 py-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  )
}

// Generic Drug Detail Skeleton
function EntityDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Card Header Skeleton */}
      <div className="border border-accent rounded-xl shadow-accent">
        <div className="border-b border-slate-200 bg-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
        
        {/* Properties Section */}
        <div className="p-6 space-y-4">
          <Skeleton className="h-5 w-20" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="border border-accent rounded-lg shadow-accent">
        <div className="flex w-full bg-transparent rounded-t-lg border-b border-accent">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="flex-1 h-10 mx-1 my-2" />
          ))}
        </div>
        <div className="p-4">
          <TabContentSkeleton />
        </div>
      </div>
    </div>
  )
}

// Tab Content Skeleton
function TabContentSkeleton() {
  return (
    <div className="space-y-3">
      <div className="border-b border-slate-200 bg-slate-200 pb-2 px-4 py-3 rounded-t-lg">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Child Entity Loading Skeleton
function ChildEntitySkeleton() {
  return (
    <div className="space-y-1 px-3 py-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 px-3 py-2">
          <Skeleton className="h-4 w-4 rounded" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Table Skeleton for larger data sets
function TableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="border-b border-slate-200 bg-slate-200 pb-2 px-4 py-3 rounded-t-lg">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 p-2 border rounded">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <div className="flex gap-1 justify-end">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { 
  Skeleton, 
  EntityListSkeleton, 
  EntityDetailSkeleton, 
  TabContentSkeleton,
  ChildEntitySkeleton,
  TableSkeleton
} 