import React from "react";
import { Icon } from "@/components/ui/icon";

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
  isDanger?: boolean;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  title, description, icon, children, isDanger = false 
}) => {
  return (
    <section className={`rounded-3xl p-8 shadow-sm ${
      isDanger ? 'bg-error/5 border border-error/10' : 'bg-surface-container-lowest border border-outline-variant/10'
    }`}>
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 ${
          isDanger ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
        }`}>
          <Icon name={icon} size={24} />
        </div>
        <div>
          <h3 className={`text-xl font-bold tracking-tight ${isDanger ? 'text-error' : 'text-on-surface'}`}>{title}</h3>
          <p className="text-sm text-outline font-medium">{description}</p>
        </div>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
};
