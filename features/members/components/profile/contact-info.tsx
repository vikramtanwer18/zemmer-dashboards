import React from "react";
import { Icon } from "@/components/ui/icon";

export const ContactInfo: React.FC = () => {
  const details = [
    { label: "Phone Number", value: "+1 555-012-3456", icon: "call" },
    { label: "Member Since", value: "Jan 12, 2023", icon: "calendar_today" },
    { label: "Email Address", value: "j.doe@example.com", icon: "mail" },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-atmospheric border border-outline-variant/10 group">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <h3 className="text-[10px] font-black text-outline tracking-[0.2em] uppercase">Contact Intelligence</h3>
      </div>
      
      <div className="space-y-6">
        {details.map((detail) => (
          <div key={detail.label} className="flex flex-col gap-1.5 group/item">
            <span className="text-[10px] font-black text-outline tracking-widest uppercase transition-colors group-hover/item:text-primary">
              {detail.label}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-on-surface tracking-tight">{detail.value}</span>
              <Icon name={detail.icon} size={16} className="text-outline/40 group-hover/item:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
