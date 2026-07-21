import React from "react";
import { Icon } from "./icon";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
}

export const Input: React.FC<InputProps> = ({ icon, className = "", ...props }) => {
  return (
    <div className="relative w-full">
      {icon && (
        <Icon 
          name={icon} 
          size={20} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" 
        />
      )}
      <input
        className={`w-full h-12 bg-surface-container-low border-none rounded-xl text-on-surface text-sm transition-all placeholder:text-outline/60 focus:ring-2 focus:ring-primary focus:outline-none ${icon ? "pl-12" : "px-4"} ${className}`}
        {...props}
      />
    </div>
  );
};
