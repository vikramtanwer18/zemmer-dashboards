import React from "react";
import { Icon } from "@/components/ui/icon";

interface ProfileQuickActionsProps {
  onFreeze: () => void;
}

export const ProfileQuickActions: React.FC<ProfileQuickActionsProps> = ({ onFreeze }) => {
  const actions = [
    { label: "Freeze Membership", icon: "ac_unit", color: "text-primary", onClick: onFreeze },
    { label: "Billing History", icon: "receipt_long", color: "text-outline", onClick: () => {} },
    { label: "Export Profile Data", icon: "ios_share", color: "text-outline", onClick: () => {} },
  ];

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-atmospheric border border-outline-variant/10 group">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <h3 className="text-[10px] font-black text-outline tracking-[0.2em] uppercase">Control Center</h3>
      </div>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <button 
            key={action.label}
            onClick={action.onClick}
            className="w-full text-left p-4 rounded-xl bg-surface-container-low/40 border border-outline-variant/10 hover:bg-white hover:shadow-sm transition-all flex items-center justify-between group/btn active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center transition-transform group-hover/btn:scale-110">
                <Icon name={action.icon} size={20} className={action.color} fill={action.label === "Freeze Membership"} />
              </div>
              <span className="text-xs font-black text-on-surface tracking-tight">{action.label}</span>
            </div>
            <Icon name="chevron_right" size={18} className="text-outline/40 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};
