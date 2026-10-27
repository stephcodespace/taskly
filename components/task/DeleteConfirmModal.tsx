"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Task } from "@/types/task";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  task,
  onClose,
  onConfirm,
}) => {
  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[#27212A] dark:text-[#FDF2F8]">
              Are you sure you want to permanently delete this task?
            </p>
            <p className="text-xs font-semibold text-[#27212A] dark:text-[#FDF2F8] bg-pink-50/40 dark:bg-[#18111A] p-2.5 rounded-xl border border-[#FBCFE8]/80 dark:border-[#3D293F] break-words">
              &ldquo;{task.title}&rdquo;
            </p>
            <p className="text-[11px] text-[#5C5262] dark:text-[#C4B5CD]">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-pink-100 dark:border-[#3D293F] flex items-center justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};
