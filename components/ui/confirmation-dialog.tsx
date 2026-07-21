"use client";

import React from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { Icon } from "./icon";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary" | "warning";
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
}) => {
  const variantStyles = {
    danger: {
      icon: "error_outline",
      iconBg: "bg-error/10",
      iconColor: "text-error",
      confirmBtn: "danger",
    },
    primary: {
      icon: "help_outline",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      confirmBtn: "primary",
    },
    warning: {
      icon: "warning",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      confirmBtn: "primary",
    },
  };

  const style = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <Modal.Body>
        <div className="pt-10 pb-2 text-center">
          <div className={`w-20 h-20 mx-auto rounded-xl ${style.iconBg} ${style.iconColor} flex items-center justify-center mb-6`}>
            <Icon name={style.icon} size={40} />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-on-surface mb-2">{title}</h3>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed max-w-md mx-auto">
            {description}
          </p>
        </div>
        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-2xl font-bold border-outline-variant/20"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={style.confirmBtn as any}
            className="flex-1 h-12 rounded-2xl font-bold shadow-lg shadow-on-surface/5"
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
