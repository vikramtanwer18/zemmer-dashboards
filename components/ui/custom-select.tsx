"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "./icon";
import { cn } from "@/lib/utils/cn";

export interface CustomSelectOption {
  label: string;
  value: string;
  icon?: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  className?: string;
  label?: string;
  error?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  icon,
  className,
  label,
  error,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
          {label}
        </label>
      )}
      <div className={cn("relative w-full", className)} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full h-12 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl flex items-center justify-between text-sm transition-all hover:border-outline-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
            icon ? "pl-12 pr-4" : "px-4",
            isOpen ? "bg-surface-container-low border-primary/50 ring-2 ring-primary/10" : "",
            error ? "border-error focus:border-error ring-2 ring-error/20" : "",
            !selectedOption && "text-outline/80"
          )}
        >
          {icon && (
            <Icon
              name={icon}
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
            />
          )}
          <span className="truncate text-on-surface">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <Icon
            name="expand_more"
            size={20}
            className={cn(
              "text-outline transition-transform duration-300",
              isOpen ? "rotate-180 text-primary" : ""
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 active:scale-[0.98]",
                    value === opt.value
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  )}
                >
                  {opt.icon && <Icon name={opt.icon} size={18} className={value === opt.value ? "text-primary" : "text-outline"} />}
                  <span className="flex-1 truncate">{opt.label}</span>
                  {value === opt.value && (
                    <Icon name="check" size={18} className="text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className="text-xs font-medium text-error ml-1 flex items-center gap-1">
          <Icon name="error" size={14} />
          {error}
        </p>
      )}
    </div>
  );
}
