import React from "react";
import { Icon } from "./icon";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ icon, options, className = "", ...props }) => {
  return (
    <div className="relative w-full">
      {icon && (
        <Icon 
          name={icon} 
          size={20} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" 
        />
      )}
      <select
        className={`w-full h-12 bg-surface-container-low border-none rounded-xl text-on-surface text-sm transition-all appearance-none cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none ${icon ? "pl-12" : "px-4"} pr-10 ${className}`}
        {...props}
      >
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
  );
};
