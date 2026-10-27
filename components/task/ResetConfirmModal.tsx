"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset to Default Data"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-[#DB2777] dark:bg-[#381A2D] dark:text-[#F472B6]">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[#27212A] dark:text-[#FDF2F8]">
              Are you sure you want to restore the 5 initial sample tasks?
            </p>
            <p className="text-xs text-[#5C5262] dark:text-[#C4B5CD] leading-relaxed">
              All current changes or custom tasks will be replaced by the default demo dataset.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-pink-100 dark:border-[#3D293F] flex items-center justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Reset Data
          </Button>
        </div>
      </div>
    </Modal>
  );
};
