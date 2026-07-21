import React from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  loading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    "w-full h-12 font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-lg shadow-primary/20 hover:opacity-90",
    secondary:
      "bg-secondary-container text-on-secondary-container shadow-secondary/10 hover:bg-secondary-container/80",
    outline:
      "bg-surface-container-low hover:bg-surface-container-high text-on-surface border-none",
    ghost:
      "bg-transparent hover:bg-surface-container-low text-on-surface-variant",
    danger:
      "bg-error text-on-error shadow-lg shadow-error/20 hover:bg-error/90",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
};
