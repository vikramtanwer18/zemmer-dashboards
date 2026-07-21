import React from "react";
import { Icon } from "@/components/ui/icon";

export const InternalNotes: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <Icon name="description" size={18} className="text-primary" />
          <h5 className="text-sm font-bold text-on-surface tracking-tight">Internal Notes</h5>
        </div>
        <button className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95">
          <Icon name="add" size={18} />
        </button>
      </div>
      
      <div className="p-4 bg-surface-container-low/50 rounded-2xl border border-outline-variant/10 relative z-10 transition-all hover:bg-white hover:shadow-sm group/note">
        <p className="text-sm text-on-surface-variant/90 leading-relaxed font-medium">
          Member requested split payment option for future PT sessions. Follow up next week.
        </p>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">S</div>
          <p className="text-xs text-on-surface font-semibold">Admin Sarah</p>
          <span className="text-[10px] text-outline font-medium ml-auto">Oct 14</span>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
    </div>
  );
};
