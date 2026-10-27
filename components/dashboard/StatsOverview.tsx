"use client";

import React from "react";
import {
  Layers,
  CircleDot,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { TaskStats } from "@/types/task";

interface StatsOverviewProps {
  stats: TaskStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const percentage =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  // SVG circular progress parameters
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl border border-[#FBCFE8]/80 bg-white p-4 sm:p-5 shadow-xs transition-all dark:border-[#3D293F] dark:bg-[#231B26]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Side: Circular Progress Widget */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center shrink-0">
            <svg
              className="h-16 w-16 -rotate-90 transform"
              viewBox="0 0 64 64"
              aria-hidden="true"
            >
              {/* Background Track */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-[#FCE7F3] dark:text-[#381A2D]"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Ring */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-[#DB2777] dark:text-[#F472B6] transition-all duration-500 ease-out"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-[#27212A] dark:text-[#FDF2F8]">
                {percentage}%
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-[#27212A] dark:text-[#FDF2F8] tracking-tight">
              Progress Overview
            </h2>
            <p className="text-xs text-[#5C5262] dark:text-[#C4B5CD]">
              {stats.done} of {stats.total} {stats.total === 1 ? "task" : "tasks"} completed
            </p>
          </div>
        </div>

        {/* Right Side: Status Chips / Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Total Tasks Chip */}
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#FBCFE8]/70 bg-pink-50/40 px-3 py-1.5 text-xs font-medium text-[#27212A] dark:border-[#3D293F] dark:bg-[#18111A] dark:text-[#FDF2F8]">
            <Layers className="h-3.5 w-3.5 text-[#5C5262] dark:text-[#C4B5CD]" />
            <span>Total:</span>
            <span className="font-bold text-[#DB2777] dark:text-[#F472B6]">
              {stats.total}
            </span>
          </div>

          {/* To Do Chip */}
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-[#3D293F] dark:bg-[#1F1722] dark:text-[#C4B5CD]">
            <CircleDot className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>To Do:</span>
            <span className="font-bold">{stats.todo}</span>
          </div>

          {/* In Progress Chip */}
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#FBCFE8] bg-pink-50/70 px-3 py-1.5 text-xs font-medium text-[#DB2777] dark:border-[#523755] dark:bg-[#381A2D] dark:text-[#F472B6]">
            <Clock className="h-3.5 w-3.5 text-[#DB2777] dark:text-[#F472B6]" />
            <span>In Progress:</span>
            <span className="font-bold">{stats.inProgress}</span>
          </div>

          {/* Done Chip */}
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Done:</span>
            <span className="font-bold">{stats.done}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
