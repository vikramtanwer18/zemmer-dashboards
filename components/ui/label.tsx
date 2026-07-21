import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ children, className = "", ...props }) => {
  return (
    <label
      className={`block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};
