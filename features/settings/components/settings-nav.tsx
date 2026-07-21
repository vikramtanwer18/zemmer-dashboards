import React from "react";
import { Icon } from "@/components/ui/icon";

export const SettingsNav: React.FC = () => {
  const sections = [
    { label: "General Information", active: true, icon: "settings" },
  ];

  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm space-y-2">
      <p className="text-xs font-bold text-outline mb-6 px-1">Navigation</p>
      {sections.map((section) => (
        <a
          key={section.label}
          className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${section.active
            ? "bg-primary/5 text-primary border border-primary/10 shadow-sm"
            : "text-on-surface-variant hover:bg-surface-container-low border border-transparent"
            }`}
          href="#"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.active ? 'bg-primary/10' : 'bg-surface-container-low'}`}>
              <Icon name={section.icon} size={18} fill={section.active} className={section.active ? "text-primary" : "text-outline"} />
            </div>
            <span className={`text-sm ${section.active ? 'font-bold' : 'font-medium'}`}>{section.label}</span>
          </div>
          <Icon name="chevron_right" size={16} className={`transition-transform duration-300 ${section.active ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
        </a>
      ))}
    </div>
  );
};
