"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Task, TaskFormData, TaskStatus, TaskStats } from "@/types/task";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "@/components/layout/Header";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { TaskModal } from "@/components/task/TaskModal";
import { DeleteConfirmModal } from "@/components/task/DeleteConfirmModal";
import { ResetConfirmModal } from "@/components/task/ResetConfirmModal";
import {
  addCloudTask,
  editCloudTask,
  removeCloudTask,
  changeCloudTaskStatus,
} from "@/lib/supabase/taskActions";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";


export default function DashboardPage() {
  const { theme, toggleTheme } = useTheme();
const { user, loading: authLoading } = useAuth();
const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

const {
  mode,
  phase,
  isSaving,
  setIsSaving,
  setStorageError,
  setTasks,
} = useTaskStore();

const {
  tasks,
  isHydrated,
  storageError,
  addTask,
  updateTask,
  deleteTask,
  moveTaskStatus,
  resetToSampleTasks,
} = useTaskStore();


  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [preselectedStatus, setPreselectedStatus] = useState<TaskStatus>("todo");

  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // User Feedback Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  };

  // Compute live task statistics
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    let todo = 0;
    let inProgress = 0;
    let done = 0;

    for (const task of tasks) {
      if (task.status === "todo") todo++;
      else if (task.status === "in_progress") inProgress++;
      else if (task.status === "done") done++;
    }

    return { total, todo, inProgress, done };
  }, [tasks]);

  // Task Manipulation Handlers
const handleOpenCreateTask = (status: TaskStatus = "todo") => {
  if (authLoading) {
    showToast("Please wait while your session is loading.");
    return;
  }

  if (!user) {
    setIsAuthModalOpen(true);
    return;
  }

  setEditingTask(null);
  setPreselectedStatus(status);
  setIsTaskModalOpen(true);
};

  const handleOpenEditTask = (task: Task) => {
  if (authLoading) {
    showToast("Please wait while your session is loading.");
    return;
  }

  if (!user) {
    setIsAuthModalOpen(true);
    return;
  }

  setEditingTask(task);
  setPreselectedStatus(task.status);
  setIsTaskModalOpen(true);
};

const handleTaskSubmit = async (formData: TaskFormData) => {
  if (authLoading || phase !== "ready" || isSaving) {
    showToast("Please wait until Taskly is ready.");
    return;
  }

  if (mode === "guest") {
    showToast("Please sign in to create or edit tasks.");
    return;
  }

  if (!user || user.id !== useTaskStore.getState().activeUserId) {
    showToast("Your session is not ready. Please try again.");
    return;
  }

  setIsSaving(true);

  try {
    if (editingTask) {
      const updatedTask = await editCloudTask(editingTask.id, formData);

      setTasks(
        useTaskStore.getState().tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      );

      showToast("Task updated successfully.");
    } else {
      const newTask = await addCloudTask(formData);

      setTasks([newTask, ...useTaskStore.getState().tasks]);

      showToast("Task created successfully.");
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
  } catch (error) {
    console.error("Failed to save task:", error);
    showToast(
      error instanceof Error
        ? error.message
        : "Failed to save task. Please try again.",
    );
  } finally {
    setIsSaving(false);
  }
};



const handleOpenDelete = (task: Task) => {
  if (authLoading) {
    showToast("Please wait while your session is loading.");
    return;
  }

  if (!user) {
    setIsAuthModalOpen(true);
    return;
  }

  setDeletingTask(task);
  setIsDeleteModalOpen(true);
};


  
const handleConfirmDelete = async () => {
  if (!deletingTask) return;

  if (
    authLoading ||
    phase !== "ready" ||
    mode !== "cloud" ||
    !user ||
    user.id !== useTaskStore.getState().activeUserId ||
    isSaving
  ) {
    showToast("Please sign in and wait until Taskly is ready.");
    return;
  }

  const taskId = deletingTask.id;
  setIsSaving(true);

  try {
    await removeCloudTask(taskId);

    setTasks(
      useTaskStore.getState().tasks.filter((task) => task.id !== taskId),
    );

    showToast("Task deleted successfully.");
    setIsDeleteModalOpen(false);
    setDeletingTask(null);
  } catch (error) {
    console.error("Failed to delete task:", error);
    showToast(
      error instanceof Error
        ? error.message
        : "Failed to delete task. Please try again.",
    );
  } finally {
    setIsSaving(false);
  }
};


  const handleConfirmReset = () => {
    resetToSampleTasks();
    showToast("Data restored to default sample tasks.");
  };

  
const handleMoveStatus = async (
  taskId: string,
  newStatus: TaskStatus,
) => {
  if (
    authLoading ||
    phase !== "ready" ||
    mode !== "cloud" ||
    !user ||
    user.id !== useTaskStore.getState().activeUserId ||
    isSaving
  ) {
    showToast("Please sign in and wait until Taskly is ready.");
    return;
  }

  const previousTasks = useTaskStore.getState().tasks;
  const currentTask = previousTasks.find((task) => task.id === taskId);

  if (!currentTask || currentTask.status === newStatus) return;

  setIsSaving(true);

  try {
    const updatedTask = await changeCloudTaskStatus(taskId, newStatus);

    setTasks(
      useTaskStore.getState().tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );

    const statusLabels: Record<TaskStatus, string> = {
      todo: "To Do",
      in_progress: "In Progress",
      done: "Done",
    };

    showToast(`Task moved to "${statusLabels[newStatus]}".`);
  } catch (error) {
    console.error("Failed to move task:", error);
    showToast(
      error instanceof Error
        ? error.message
        : "Failed to move task. Please try again.",
    );
  } finally {
    setIsSaving(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col bg-[#FDF2F8] text-[#27212A] dark:bg-[#18111A] dark:text-[#FDF2F8] transition-colors duration-200">
      {/* Application Header with Theme Toggle */}
      
<Header
  theme={theme}
  onToggleTheme={toggleTheme}
  onOpenCreateTask={() => handleOpenCreateTask("todo")}
  onOpenResetConfirm={() => setIsResetModalOpen(true)}
  onOpenAuth={() => setIsAuthModalOpen(true)}
/>


      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {storageError && (
  <div
    role="alert"
    className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
  >
    <p className="font-semibold">Storage warning</p>
    <p className="mt-1">{storageError}</p>
    <p className="mt-1">
      Please avoid adding, editing, deleting, or resetting tasks until
      storage access is restored.
    </p>
  </div>
)}
{!isHydrated ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Dashboard Header Section (Cleaned, no duplicate Add Task button) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#27212A] dark:text-[#FDF2F8]">
                    Task Board
                  </h1>
                  <Sparkles className="h-5 w-5 text-[#DB2777] dark:text-[#F472B6]" />
                </div>
                <p className="mt-1 text-sm text-[#5C5262] dark:text-[#C4B5CD] max-w-2xl">
                  Organize, track, and accomplish your daily priorities with ease.
                </p>
              </div>
            </div>

            {/* Compact Progress Overview (Circular Progress Ring & Status Chips) */}
            <section aria-label="Task progress summary">
              <StatsOverview stats={stats} />
            </section>

            {/* Kanban Board — Hero Focus (3 Columns: To Do, In Progress, Done) */}
            <section aria-label="Kanban task workflow" className="pt-1">
              <KanbanBoard
                tasks={tasks}
                onEditTask={handleOpenEditTask}
                onDeleteTask={handleOpenDelete}
                onMoveTaskStatus={handleMoveStatus}
                onAddTask={(status) => handleOpenCreateTask(status)}
              />
            </section>
          </>
        )}
      </main>

      {/* Application Footer */}
      <footer className="mt-auto border-t border-[#FBCFE8]/70 bg-white/60 dark:bg-[#231B26]/60 dark:border-[#3D293F] py-4 text-center text-xs text-[#5C5262] dark:text-[#C4B5CD]">
        <p>Taskly &copy; 2026 — Productivity Task Dashboard</p>
      </footer>

      {/* Task Form Modal (Add / Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        initialTask={editingTask}
        defaultStatus={preselectedStatus}
        onSubmit={handleTaskSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={deletingTask}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTask(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      {/* User Feedback Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-[#27212A] text-white px-4 py-3 text-sm shadow-xl border border-pink-900/40 dark:bg-[#231B26] dark:text-[#FDF2F8] dark:border-[#3D293F] transition-all duration-300"
        >
          <CheckCircle2 className="h-4 w-4 text-[#F472B6] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
      <AuthModal
  isOpen={isAuthModalOpen}
  onClose={() => setIsAuthModalOpen(false)}
/>
    </div>
  );
}
