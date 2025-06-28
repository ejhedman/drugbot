'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This operation is irreversible.",
  confirmText = "Yes",
  cancelText = "Cancel",
  isLoading = false
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for using confirmation dialog
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onConfirmAction, setOnConfirmAction] = useState<(() => Promise<void>) | null>(null);

  const openDialog = (action: () => Promise<void>) => {
    setOnConfirmAction(() => action);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setIsLoading(false);
    setOnConfirmAction(null);
  };

  const handleConfirm = async () => {
    if (onConfirmAction) {
      try {
        setIsLoading(true);
        await onConfirmAction();
        closeDialog();
      } catch (error) {
        console.error('Delete operation failed:', error);
        setIsLoading(false);
      }
    }
  };

  return {
    isOpen,
    isLoading,
    openDialog,
    closeDialog,
    handleConfirm,
  };
} 