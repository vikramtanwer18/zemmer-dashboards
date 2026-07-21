import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, id, className = "", ...props }) => {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        id={id}
        className={`w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary ${className}`}
        {...props}
      />
      <label htmlFor={id} className="text-sm font-medium text-on-surface-variant cursor-pointer">
        {label}
      </label>
    </div>
  );
};
