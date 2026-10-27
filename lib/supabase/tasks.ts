
import type { Task, TaskFormData } from "@/types/task";
import { createClient } from "@/lib/supabase/client";

type TaskRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: Task["status"];
  priority: Task["priority"];
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function createTaskId(): string {
  return crypto.randomUUID();
}

export async function fetchTasks(userId: string): Promise<Task[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load tasks: ${error.message}`);
  }

  return (data as TaskRow[]).map(mapTask);
}

export async function createTask(
  userId: string,
  formData: TaskFormData,
): Promise<Task> {
  const supabase = createClient();
  const title = formData.title.trim();

  if (!title) {
    throw new Error("Task title cannot be empty.");
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      id: createTaskId(),
      user_id: userId,
      title,
      description: formData.description?.trim() || null,
      status: formData.status,
      priority: formData.priority,
      due_date: formData.dueDate || null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }

  return mapTask(data as TaskRow);
}

export async function updateTask(
  userId: string,
  taskId: string,
  changes: Partial<TaskFormData>,
): Promise<Task> {
  const supabase = createClient();
  const payload: {
    title?: string;
    description?: string | null;
    status?: Task["status"];
    priority?: Task["priority"];
    due_date?: string | null;
    updated_at: string;
  } = {
    updated_at: new Date().toISOString(),
  };

  if (changes.title !== undefined) {
    const title = changes.title.trim();

    if (!title) {
      throw new Error("Task title cannot be empty.");
    }

    payload.title = title;
  }

  if (changes.description !== undefined) {
    payload.description = changes.description.trim() || null;
  }

  if (changes.status !== undefined) {
    payload.status = changes.status;
  }

  if (changes.priority !== undefined) {
    payload.priority = changes.priority;
  }

  if (changes.dueDate !== undefined) {
    payload.due_date = changes.dueDate || null;
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(payload)
    .eq("id", taskId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }

  if (!data) {
    throw new Error("Task was not found or you do not have permission to update it.");
  }

  return mapTask(data as TaskRow);
}

export async function deleteTask(
  userId: string,
  taskId: string,
): Promise<void> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }

  if (!data) {
    throw new Error("Task was not found or you do not have permission to delete it.");
  }
}
