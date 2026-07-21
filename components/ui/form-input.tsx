"use client";

import React from "react";
import { Icon } from "./icon";
import { cn } from "@/lib/utils/cn";

type BaseProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix">;

interface FormInputProps extends BaseProps {
  label?: string;
  icon?: string;
  error?: string;
  hint?: string;
  rightSlot?: React.ReactNode;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon, error, hint, rightSlot, className = "", id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <Icon
              name={icon}
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
            />
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              "w-full h-12 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-on-surface text-sm transition-all placeholder:text-outline/60 focus:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none hover:border-outline-variant/40",
              icon ? "pl-12 pr-4" : "px-4",
              rightSlot && "pr-12",
              error && "border-error focus:border-error ring-2 ring-error/20 focus:ring-error/20",
              className,
            )}
            {...props}
          />
          {rightSlot && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightSlot}
            </div>
          )}
        </div>
        {error ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs font-medium text-error ml-1 flex items-center gap-1"
          >
            <Icon name="error" size={14} />
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-outline ml-1">{hint}</p>
        ) : null}
      </div>
    );
  },
);
FormInput.displayName = "FormInput";

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: string;
  error?: string;
  hint?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    { label, icon, error, hint, className = "", id, options, placeholder, ...props },
    ref,
  ) => {
    const selectId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <Icon
              name={icon}
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
            />
          )}
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            className={cn(
              "w-full h-12 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-on-surface text-sm transition-all appearance-none cursor-pointer focus:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none hover:border-outline-variant/40",
              icon ? "pl-12" : "px-4",
              "pr-10",
              error && "border-error focus:border-error ring-2 ring-error/20 focus:ring-error/20",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Icon
            name="expand_more"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
          />
        </div>
        {error ? (
          <p role="alert" className="text-xs font-medium text-error ml-1 flex items-center gap-1">
            <Icon name="error" size={14} />
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-outline ml-1">{hint}</p>
        ) : null}
      </div>
    );
  },
);
FormSelect.displayName = "FormSelect";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(({ label, error, hint, className = "", id, ...props }, ref) => {
  const taId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={taId}
          className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={taId}
        aria-invalid={!!error}
        className={cn(
          "w-full bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-on-surface text-sm transition-all placeholder:text-outline/60 focus:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none hover:border-outline-variant/40 px-4 py-3 resize-none min-h-[96px]",
          error && "border-error focus:border-error ring-2 ring-error/20 focus:ring-error/20",
          className,
        )}
        {...props}
      />
      {error ? (
        <p role="alert" className="text-xs font-medium text-error ml-1">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-outline ml-1">{hint}</p>
      ) : null}
    </div>
  );
});
FormTextarea.displayName = "FormTextarea";
