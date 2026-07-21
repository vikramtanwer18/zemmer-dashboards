import React from "react";
import { Icon } from "@/components/ui/icon";

export const ScheduleKPIs: React.FC = () => {
  const kpis = [
    { label: "Live Occupancy", value: "42", total: "/ 120", icon: "groups", variant: "default" as const },
    { label: "Active Classes", value: "03", icon: "bolt", variant: "tertiary" as const },
    { label: "Revenue Today", value: "$1,240", icon: "payments", variant: "default" as const },
  ];

  const variantStyles = {
    default: "bg-primary/10 text-primary",
    tertiary: "bg-tertiary/10 text-tertiary",
    error: "bg-error/10 text-error",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {kpis.map((kpi, idx) => (
        <div 
          key={idx} 
          className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-atmospheric flex items-center gap-5 group hover:border-primary/20 transition-all duration-300"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${variantStyles[kpi.variant]} transition-transform duration-300 group-hover:scale-110`}>
            <Icon name={kpi.icon} size={24} fill={true} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-outline uppercase tracking-[0.15em] mb-0.5">{kpi.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-on-surface">
                {kpi.value}
                {kpi.total && <span className="text-sm font-bold text-outline-variant ml-1">{kpi.total}</span>}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
