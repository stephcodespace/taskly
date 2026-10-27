
import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import type { Task, TaskFormData, TaskStatus } from "@/types/task";
import { INITIAL_SAMPLE_TASKS } from "./sampleData";
import {
  isStorageWriteAllowed,
  notifyHydrationComplete,
} from "@/lib/storeAuthBridge";
type TaskMode = "guest" | "cloud";
type TaskPhase =
  | "boot"
  | "awaiting_hydration"
  | "hydrated_awaiting_auth"
  | "loading_cloud"
  | "ready"
  | "error";

interface TaskStoreState {
  isSaving: boolean;

  mode: TaskMode;
  phase: TaskPhase;
  activeUserId: string | null;
  tasks: Task[];
  isHydrated: boolean;
  storageError: string | null;

  setIsSaving: (isSaving: boolean) => void;
  setMode: (mode: TaskMode) => void;
  setPhase: (phase: TaskPhase) => void;
  setActiveUserId: (userId: string | null) => void;
  setTasks: (tasks: Task[]) => void;

  // Actions
  setHydrated: (isHydrated: boolean) => void;
  setStorageError: (error: string | null) => void;
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: Partial<TaskFormData>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => void;
  resetToSampleTasks: () => void;
}


const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      if (typeof window === "undefined") return null;
      return window.localStorage.getItem(name);
    } catch (error) {
      console.error("Taskly: failed to read localStorage.", error);
      throw error;
    }
  },


  setItem: (name, value) => {
    // Jangan menulis sebelum status aplikasi dipastikan.
    if (!isStorageWriteAllowed()) {
      return;
    }

    try {
      if (typeof window === "undefined") {
        throw new Error("Browser storage is not available.");
      }

      window.localStorage.setItem(name, value);
    } catch (error) {
      console.error("Taskly: failed to save localStorage.", error);
      throw error;
    }
  },


  removeItem: (name) => {
    try {
      if (typeof window === "undefined") {
        throw new Error("Browser storage is not available.");
      }

      window.localStorage.removeItem(name);
    } catch (error) {
      console.error("Taskly: failed to remove localStorage.", error);
      throw error;
    }
  },
};

export const useTaskStore = create<TaskStoreState>()(
  persist(
    (set) => ({
      tasks: INITIAL_SAMPLE_TASKS,
      isHydrated: false,
      storageError: null,
      isSaving: false,
      setTasks: (tasks) => set({ tasks }),

      setIsSaving: (isSaving) => set({ isSaving }),
      mode: "guest",
      phase: "boot",
      activeUserId: null,
      setMode: (mode) => set({ mode }),
      setPhase: (phase) => set({ phase }),
      setActiveUserId: (activeUserId) => set({ activeUserId }),

      setHydrated: (isHydrated) => set({ isHydrated }),

      setStorageError: (storageError) => set({ storageError }),

      addTask: (data) => {
        const trimmedTitle = data.title.trim();
        if (!trimmedTitle) return;

        const now = new Date().toISOString();

        const newTask: Task = {
          id:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `task-${Date.now()}`,
          title: trimmedTitle,
          description: data.description?.trim() || undefined,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate || undefined,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
      },

      updateTask: (id, data) => {
        const now = new Date().toISOString();

        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;

            const title =
              data.title !== undefined
                ? data.title.trim()
                : task.title;

            // Jangan menyimpan judul kosong.
            if (!title) return task;

            return {
              ...task,
              title,
              description:
                data.description !== undefined
                  ? data.description.trim() || undefined
                  : task.description,
              status: data.status ?? task.status,
              priority: data.priority ?? task.priority,
              dueDate:
                data.dueDate !== undefined
                  ? data.dueDate || undefined
                  : task.dueDate,
              updatedAt: now,
            };
          }),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      moveTaskStatus: (id, newStatus) => {
        const now = new Date().toISOString();

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, status: newStatus, updatedAt: now }
              : task,
          ),
        }));
      },

      resetToSampleTasks: () => {
        set({ tasks: INITIAL_SAMPLE_TASKS });
      },
    }),
    {
      name: "taskly-storage",
      version: 1,

      storage: createJSONStorage(() => safeStorage),

      // Pertahankan format penyimpanan lama.
      partialize: (state) => ({
        tasks: state.tasks,
      }),


      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error(
            "Taskly: hydration failed. Existing browser data was not intentionally deleted.",
            error,
          );

          state?.setStorageError(
            "Task data could not be loaded from browser storage. Avoid changing or resetting tasks until the problem is resolved.",
          );

          state?.setHydrated(false);

          notifyHydrationComplete(false);
          return;
        }

        state?.setStorageError(null);
        state?.setHydrated(true);

        notifyHydrationComplete(true);
      },

    },
  ),
);
