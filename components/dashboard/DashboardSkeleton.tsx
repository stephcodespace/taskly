"use client";

import React from "react";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6 animate-pulse"
      aria-busy="true"
      aria-label="Loading task dashboard"
    >
      {/* Title & Description Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-44 bg-pink-100/60 dark:bg-[#3D293F] rounded-xl"></div>
        <div className="h-4 w-72 bg-pink-100/40 dark:bg-[#2E2332] rounded-lg"></div>
      </div>

      {/* Stats Overview Skeleton (Circular Progress & Chips) */}
      <div className="h-24 rounded-2xl bg-white/70 dark:bg-[#231B26] border border-[#FBCFE8]/50 dark:border-[#3D293F] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-pink-100/70 dark:bg-[#381A2D]"></div>
          <div className="space-y-2">
            <div className="h-4 w-28 bg-pink-100/60 dark:bg-[#3D293F] rounded"></div>
            <div className="h-3 w-36 bg-pink-100/40 dark:bg-[#2E2332] rounded"></div>
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 w-24 bg-pink-100/50 dark:bg-[#2E2332] rounded-xl"
            ></div>
          ))}
        </div>
      </div>

      {/* Kanban Columns Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {[1, 2, 3].map((col) => (
          <div
            key={col}
            className="flex flex-col rounded-2xl bg-white/60 dark:bg-[#1F1722] p-4 border border-[#FBCFE8]/50 dark:border-[#3D293F] min-h-[460px] space-y-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 dark:border-[#3D293F]">
              <div className="h-5 w-24 bg-pink-100/60 dark:bg-[#3D293F] rounded"></div>
              <div className="h-6 w-6 bg-pink-100/70 dark:bg-[#381A2D] rounded-xl"></div>
            </div>
            <div className="h-32 bg-white dark:bg-[#231B26] rounded-2xl border border-pink-100/70 dark:border-[#3D293F] p-4 space-y-2.5">
              <div className="h-4 w-16 bg-pink-100/50 dark:bg-[#381A2D] rounded"></div>
              <div className="h-5 w-3/4 bg-pink-100/60 dark:bg-[#3D293F] rounded"></div>
              <div className="h-4 w-full bg-pink-100/30 dark:bg-[#2E2332] rounded"></div>
            </div>
            <div className="h-28 bg-white dark:bg-[#231B26] rounded-2xl border border-pink-100/70 dark:border-[#3D293F] p-4 space-y-2.5">
              <div className="h-4 w-14 bg-pink-100/50 dark:bg-[#381A2D] rounded"></div>
              <div className="h-5 w-2/3 bg-pink-100/60 dark:bg-[#3D293F] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
