"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Task, TaskFormData, TaskPriority, TaskStatus } from "@/types/task";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task | null;
  defaultStatus?: TaskStatus;
  onSubmit: (data: TaskFormData) => void;
}

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

interface TaskFormContentProps {
  initialTask?: Task | null;
  defaultStatus: TaskStatus;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

const TaskFormContent: React.FC<TaskFormContentProps> = ({
  initialTask,
  defaultStatus,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || "medium");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || "");
  const [titleError, setTitleError] = useState("");

  const titleInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!initialTask;

  // Focus title input when modal form mounts
  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate title is required and trimmed
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Task title is required.");
      titleInputRef.current?.focus();
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate || undefined,
    });

    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Title Input */}
      <Input
        ref={titleInputRef}
        label="Task Title"
        placeholder="e.g. Build authentication module"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (titleError && e.target.value.trim()) {
            setTitleError("");
          }
        }}
        error={titleError}
        required
      />

      {/* Description Input */}
      <Textarea
        label="Description (Optional)"
        placeholder="Add any relevant notes or details about this task..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      {/* Status & Priority Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          options={STATUS_OPTIONS}
        />

        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          options={PRIORITY_OPTIONS}
        />
      </div>

      {/* Due Date Input */}
      <Input
        type="date"
        label="Due Date (Optional)"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        helperText="Format: target completion date for this task"
      />

      {/* Form Action Buttons */}
      <div className="pt-3 border-t border-pink-100 dark:border-[#3D293F] flex items-center justify-end gap-2.5">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {isEditMode ? "Save Changes" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  initialTask,
  defaultStatus = "todo",
  onSubmit,
}) => {
  if (!isOpen) return null;

  const isEditMode = !!initialTask;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Task" : "Add New Task"}
      description={
        isEditMode
          ? "Update the task details and save your changes."
          : "Fill in the details below to add a new task to your Kanban board."
      }
      maxWidth="md"
    >
      <TaskFormContent
        key={initialTask ? initialTask.id : `create-${defaultStatus}`}
        initialTask={initialTask}
        defaultStatus={defaultStatus}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};
