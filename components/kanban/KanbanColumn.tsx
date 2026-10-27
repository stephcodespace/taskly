"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { EmptyColumnState } from "./EmptyColumnState";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onMoveTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  tasks,
  onEditTask,
  onDeleteTask,
  onMoveTaskStatus,
  onAddTask,
}) => {
  const columnStyles = {
    todo: "bg-white/70 border-[#FBCFE8]/70 dark:bg-[#1E1622]/70 dark:border-[#3D293F]",
    in_progress:
      "bg-pink-50/40 border-[#FBCFE8] dark:bg-[#261624]/70 dark:border-[#421D38]",
    done: "bg-emerald-50/30 border-emerald-200/70 dark:bg-[#14221A]/70 dark:border-[#1D3D2B]",
  };

  const dotColorClass = {
    todo: "bg-slate-400 ring-4 ring-slate-100 dark:bg-slate-500 dark:ring-slate-800",
    in_progress:
      "bg-[#DB2777] ring-4 ring-pink-100 dark:bg-[#F472B6] dark:ring-[#381A2D]",
    done: "bg-emerald-500 ring-4 ring-emerald-100 dark:bg-emerald-400 dark:ring-emerald-950",
  };

  const headerBorderColor = {
    todo: "border-pink-100/80 dark:border-[#3D293F]",
    in_progress: "border-pink-200/80 dark:border-[#421D38]",
    done: "border-emerald-200/60 dark:border-[#1D3D2B]",
  };

  return (
    <section
      aria-label={`${title} column`}
      className={cn(
        "flex flex-col rounded-2xl p-4 border min-h-[460px] transition-all",
        columnStyles[status]
      )}
    >
      {/* Column Header */}
      <div
        className={cn(
          "flex items-center justify-between pb-3.5 mb-3.5 border-b",
          headerBorderColor[status]
        )}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={cn("h-2.5 w-2.5 rounded-full", dotColorClass[status])}
            aria-hidden="true"
          />
          <h2 className="text-sm font-bold text-[#27212A] dark:text-[#FDF2F8] tracking-tight">
            {title}
          </h2>
          <span
            className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-xs font-semibold text-[#5C5262] shadow-2xs border border-[#FBCFE8]/70 dark:bg-[#231B26] dark:text-[#C4B5CD] dark:border-[#3D293F]"
            aria-label={`${tasks.length} tasks`}
          >
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddTask(status)}
          aria-label={`Add new task to ${title} column`}
          title={`Add task to ${title}`}
          className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-[#5C5262] hover:text-[#DB2777] hover:border-[#DB2777] border border-[#FBCFE8] shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB2777] dark:bg-[#231B26] dark:text-[#C4B5CD] dark:border-[#3D293F] dark:hover:text-[#F472B6] dark:hover:border-[#F472B6]"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Task List or Empty State */}
      <div className="flex flex-1 flex-col gap-3">
        {tasks.length === 0 ? (
          <EmptyColumnState
            status={status}
            onAddTask={() => onAddTask(status)}
          />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMoveStatus={onMoveTaskStatus}
            />
          ))
        )}
      </div>
    </section>
  );
};
