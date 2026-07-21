import React from "react";
import { Icon } from "./icon";
import { cn } from "@/lib/utils/cn";

export function Spinner({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block border-2 border-current border-t-transparent rounded-full animate-spin",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-surface-container-high/50 rounded-lg animate-pulse",
        className,
      )}
    />
  );
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-8">
      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        <Icon name={icon} size={28} />
      </div>
      <h3 className="text-base font-bold text-on-surface">{title}</h3>
      {description && (
        <p className="text-sm text-outline font-medium mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-8">
      <div className="w-14 h-14 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
        <Icon name="error" size={28} />
      </div>
      <h3 className="text-base font-bold text-on-surface">{title}</h3>
      {description && (
        <p className="text-sm text-outline font-medium mt-1 max-w-sm">
          {description}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-xs font-bold text-primary hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-on-surface-variant gap-3">
      <Spinner size={32} className="text-primary" />
      <p className="text-sm font-medium animate-pulse">{label}</p>
    </div>
  );
}
