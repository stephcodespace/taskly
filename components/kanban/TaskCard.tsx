"use client";

import React from "react";
import {
  Calendar,
  AlertTriangle,
  Pencil,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { Badge } from "@/components/ui/Badge";
import { formatDisplayDate, isTaskOverdue } from "@/lib/date";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMoveStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onMoveStatus,
}) => {
  const isOverdue = isTaskOverdue(task.dueDate, task.status);

  return (
    <article
      aria-label={`Task: ${task.title}`}
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-white p-4 shadow-2xs transition-all duration-150 ease-out hover:shadow-md dark:bg-[#231B26]",
        isOverdue
          ? "border-l-4 border-l-rose-500 border-rose-200/80 bg-rose-50/15 dark:border-l-rose-500 dark:border-rose-900/60 dark:bg-rose-950/10"
          : "border-[#FBCFE8]/70 hover:border-[#F472B6]/70 dark:border-[#3D293F] dark:hover:border-[#523755]"
      )}
    >
      {/* Top Row: Priority Badge & Overdue Indicator */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={task.priority} size="sm">
            {PRIORITY_LABELS[task.priority]}
          </Badge>

          {isOverdue && (
            <Badge
              variant="overdue"
              size="sm"
              className="flex items-center gap-1"
              title="This task is past its due date and not yet completed"
            >
              <AlertTriangle className="h-3 w-3 text-rose-600 dark:text-rose-300" />
              <span>Overdue</span>
            </Badge>
          )}
        </div>

        {/* Quick Action Buttons: Edit & Delete */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit task ${task.title}`}
            title="Edit task"
            className="rounded-lg p-1.5 text-[#5C5262] hover:text-[#DB2777] hover:bg-pink-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB2777] dark:text-[#C4B5CD] dark:hover:text-[#F472B6] dark:hover:bg-[#2E2332]"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Delete task ${task.title}`}
            title="Delete task"
            className="rounded-lg p-1.5 text-[#5C5262] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-[#C4B5CD] dark:hover:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h3 className="text-sm font-semibold text-[#27212A] dark:text-[#FDF2F8] leading-snug break-words">
        {task.title}
      </h3>

      {/* Description (if provided) */}
      {task.description && (
        <p className="mt-1.5 text-xs text-[#5C5262] dark:text-[#C4B5CD] line-clamp-3 leading-relaxed break-words">
          {task.description}
        </p>
      )}

      {/* Bottom Row: Due Date & Status Switcher */}
      <div className="mt-4 pt-3 border-t border-pink-100/80 dark:border-[#3D293F] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        {/* Due Date */}
        <div className="flex items-center gap-1.5 text-xs">
          {task.dueDate ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                isOverdue
                  ? "text-rose-600 dark:text-rose-400 font-semibold"
                  : "text-[#5C5262] dark:text-[#C4B5CD]"
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDisplayDate(task.dueDate)}</span>
            </span>
          ) : (
            <span className="text-[#5C5262]/60 dark:text-[#C4B5CD]/40 text-[11px] italic">
              No due date
            </span>
          )}
        </div>

        {/* Quick Move Status Buttons */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          {task.status === "todo" && (
            <button
              type="button"
              onClick={() => onMoveStatus(task.id, "in_progress")}
              aria-label="Move task to In Progress"
              className="inline-flex items-center gap-1 rounded-lg bg-pink-50 px-2 py-1 text-[11px] font-medium text-[#DB2777] hover:bg-pink-100 active:bg-pink-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB2777] dark:bg-[#381A2D] dark:text-[#F472B6] dark:hover:bg-[#522543]"
            >
              <span>Start</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}

          {task.status === "in_progress" && (
            <>
              <button
                type="button"
                onClick={() => onMoveStatus(task.id, "todo")}
                aria-label="Move task back to To Do"
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:bg-[#1F1722] dark:text-[#C4B5CD] dark:hover:bg-[#2E2332]"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>To Do</span>
              </button>
              <button
                type="button"
                onClick={() => onMoveStatus(task.id, "done")}
                aria-label="Mark task as Done"
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
              >
                <span>Done</span>
                <CheckCircle className="h-3 w-3" />
              </button>
            </>
          )}

          {task.status === "done" && (
            <button
              type="button"
              onClick={() => onMoveStatus(task.id, "in_progress")}
              aria-label="Reopen task to In Progress"
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:bg-[#1F1722] dark:text-[#C4B5CD] dark:hover:bg-[#2E2332]"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Reopen</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
