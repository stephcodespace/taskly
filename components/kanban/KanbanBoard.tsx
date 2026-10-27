"use client";

import React, { useMemo } from "react";
import { Task, TaskStatus } from "@/types/task";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onMoveTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (preselectedStatus?: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onMoveTaskStatus,
  onAddTask,
}) => {
  // Group tasks by their respective status
  const groupedTasks = useMemo(() => {
    const todo: Task[] = [];
    const inProgress: Task[] = [];
    const done: Task[] = [];

    for (const task of tasks) {
      if (task.status === "todo") todo.push(task);
      else if (task.status === "in_progress") inProgress.push(task);
      else if (task.status === "done") done.push(task);
    }

    return { todo, inProgress, done };
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-start">
      <KanbanColumn
        status="todo"
        title="To Do"
        tasks={groupedTasks.todo}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onMoveTaskStatus={onMoveTaskStatus}
        onAddTask={(status) => onAddTask(status)}
      />

      <KanbanColumn
        status="in_progress"
        title="In Progress"
        tasks={groupedTasks.inProgress}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onMoveTaskStatus={onMoveTaskStatus}
        onAddTask={(status) => onAddTask(status)}
      />

      <KanbanColumn
        status="done"
        title="Done"
        tasks={groupedTasks.done}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onMoveTaskStatus={onMoveTaskStatus}
        onAddTask={(status) => onAddTask(status)}
      />
    </div>
  );
};
