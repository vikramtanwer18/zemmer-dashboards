import React from "react";
import { Icon } from "@/components/ui/icon";

export const SetupChecklist: React.FC = () => {
  const items = [
    { label: "Base configuration complete", completed: true },
    { label: "Instructor availability verified", completed: true },
    { label: "Pricing rules applied", completed: false },
    { label: "Studio room allocated", completed: false },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-atmospheric border border-outline-variant/10 group relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <h3 className="text-xs font-black text-outline tracking-[0.2em]">Setup Checklist</h3>
      </div>
      
      <ul className="space-y-4 relative z-10">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-4 text-xs group/item">
            <div className={`transition-all duration-300 ${item.completed ? 'text-primary scale-110' : 'text-outline/40 group-hover/item:text-primary/50'}`}>
              <Icon 
                name={item.completed ? "check_circle" : "radio_button_unchecked"} 
                size={20} 
                fill={item.completed} 
              />
            </div>
            <span className={`text-xs font-bold tracking-tight transition-colors ${item.completed ? 'text-on-surface' : 'text-outline'}`}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
    </div>
  );
};
