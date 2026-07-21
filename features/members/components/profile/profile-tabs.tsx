import React from "react";
import { Icon } from "@/components/ui/icon";

export const ProfileTabs: React.FC = () => {
  const tabs = [
    { label: "Overview", icon: "dashboard", active: true },
    { label: "Payments", icon: "payments" },
    { label: "Attendance", icon: "history" },
    { label: "Bookings", icon: "calendar_month" },
  ];

  return (
    <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-2xl shadow-inner border border-outline-variant/10 mb-10 w-fit">
      {tabs.map((tab) => (
        <button 
          key={tab.label}
          className={`h-11 px-6 rounded-xl text-xs font-black tracking-tight flex items-center gap-2.5 transition-all whitespace-nowrap ${
            tab.active 
              ? "bg-white text-primary shadow-sm" 
              : "text-outline hover:text-primary hover:bg-white/50"
          }`}
        >
          <Icon name={tab.icon} size={18} fill={tab.active} />
          {tab.label}
        </button>
      ))}
    </div>
  );
};
