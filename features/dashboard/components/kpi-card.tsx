import React from "react";
import { Icon } from "@/components/ui/icon";

interface KpiCardProps {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  variant?: "default" | "urgent";
  subtitle?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ 
  label, 
  value, 
  icon, 
  trend, 
  variant = "default",
  subtitle 
}) => {
  const isUrgent = variant === "urgent";

  return (
    <div className={`p-6 rounded-xl shadow-sm space-y-4 relative overflow-hidden border ${
      isUrgent ? "bg-error-container/10 border-error/5" : "bg-surface-container-lowest border-outline-variant/10"
    }`}>
      {isUrgent && (
        <div className="absolute -right-4 -top-4 opacity-10">
          <Icon name="priority_high" size={96} className="text-error" />
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${isUrgent ? "bg-error/10 text-error" : "bg-primary/5 text-primary"}`}>
          <Icon name={icon} fill={isUrgent} size={24} />
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            trend.startsWith("+") ? "bg-green-100 text-green-700" : "bg-surface-container-high text-primary"
          }`}>
            {trend}
          </span>
        )}
        {subtitle && (
          <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
            {subtitle}
          </span>
        )}
      </div>

      <div>
        <p className={`text-xs font-semibold uppercase tracking-wider ${isUrgent ? "text-error" : "text-outline"}`}>
          {label}
        </p>
        <h3 className={`text-3xl font-black tracking-tighter ${isUrgent ? "text-error" : "text-on-surface"}`}>
          {value}
        </h3>
      </div>
    </div>
  );
};
