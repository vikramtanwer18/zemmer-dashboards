import React from "react";
import { Icon } from "@/components/ui/icon";

interface InsightBoxProps {
  children: React.ReactNode;
}

export const InsightBox: React.FC<InsightBoxProps> = ({ children }) => {
  return (
    <div className="bg-surface-container-low/50 p-4 rounded-lg flex items-start gap-3 border border-outline-variant/10">
      <Icon name="info" fill className="text-primary" size={20} />
      <p className="text-xs text-on-surface-variant leading-relaxed">
        {children}
      </p>
    </div>
  );
};
