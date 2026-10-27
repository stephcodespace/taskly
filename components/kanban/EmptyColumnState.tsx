"use client";

import React from "react";
import { Plus, Inbox, PlayCircle, CheckCircle2 } from "lucide-react";
import { TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/Button";

interface EmptyColumnStateProps {
  status: TaskStatus;
  onAddTask: () => void;
}

export const EmptyColumnState: React.FC<EmptyColumnStateProps> = ({
  status,
  onAddTask,
}) => {
  const contentMap = {
    todo: {
      icon: Inbox,
      title: "No tasks yet",
      description: "Start your day by adding tasks you need to accomplish.",
      showButton: true,
      buttonText: "Add To Do Task",
    },
    in_progress: {
      icon: PlayCircle,
      title: "Nothing in progress",
      description: "Move tasks from To Do when you start working on them.",
      showButton: false,
      buttonText: "",
    },
    done: {
      icon: CheckCircle2,
      title: "No completed tasks",
      description: "Tasks you complete will appear here neatly organized.",
      showButton: false,
      buttonText: "",
    },
  };

  const { icon: Icon, title, description, showButton, buttonText } =
    contentMap[status];

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#FBCFE8] bg-pink-50/20 p-6 text-center transition-colors dark:border-[#3D293F] dark:bg-[#18111A]/40">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#DB2777] shadow-2xs border border-[#FBCFE8]/60 dark:bg-[#231B26] dark:text-[#F472B6] dark:border-[#3D293F]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-[#27212A] dark:text-[#FDF2F8]">
        {title}
      </h3>
      <p className="mt-1 text-xs text-[#5C5262] dark:text-[#C4B5CD] max-w-[220px] leading-relaxed">
        {description}
      </p>

      {showButton && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddTask}
          className="mt-4 text-xs font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{buttonText}</span>
        </Button>
      )}
    </div>
  );
};
