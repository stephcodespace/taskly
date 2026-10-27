
import type { Task, TaskFormData, TaskStatus } from "@/types/task";
import {
  createTask as createCloudTask,
  updateTask as updateCloudTask,
  deleteTask as deleteCloudTask,
} from "@/lib/supabase/tasks";
import { useTaskStore } from "@/store/useTaskStore";

function getActiveUserId(): string {
  const state = useTaskStore.getState();

  if (
    state.mode !== "cloud" ||
    state.phase !== "ready" ||
    !state.activeUserId
  ) {
    throw new Error("Please sign in before changing tasks.");
  }

  return state.activeUserId;
}

export async function addCloudTask(
  data: TaskFormData,
): Promise<Task> {
  const userId = getActiveUserId();
  return createCloudTask(userId, data);
}

export async function editCloudTask(
  taskId: string,
  changes: Partial<TaskFormData>,
): Promise<Task> {
  const userId = getActiveUserId();
  return updateCloudTask(userId, taskId, changes);
}

export async function removeCloudTask(taskId: string): Promise<void> {
  const userId = getActiveUserId();
  await deleteCloudTask(userId, taskId);
}

export async function changeCloudTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<Task> {
  return editCloudTask(taskId, { status });
}
