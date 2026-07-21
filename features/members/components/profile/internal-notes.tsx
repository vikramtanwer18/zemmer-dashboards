import React from "react";
import { Icon } from "@/components/ui/icon";

export const InternalNotes: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-atmospheric border border-outline-variant/10 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h5 className="text-[10px] font-black text-outline tracking-[0.2em] uppercase">Private Observations</h5>
        </div>
        <button className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:scale-110 transition-all shadow-sm active:scale-95">
          <Icon name="add" size={18} fill />
        </button>
      </div>
      
      <div className="p-4 bg-surface-container-low/40 rounded-xl border border-outline-variant/10 relative z-10 transition-all hover:bg-white group/note">
        <p className="text-xs text-on-surface leading-relaxed font-medium">
          Preferred training time is early morning (6:00 AM). Interested in Personal Training sessions for strength goals. Has a history of knee minor discomfort.
        </p>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-black text-primary uppercase">R</div>
          <p className="text-[9px] text-outline font-black tracking-widest uppercase">Admin Rahul • 2 days ago</p>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
    </div>
  );
};
