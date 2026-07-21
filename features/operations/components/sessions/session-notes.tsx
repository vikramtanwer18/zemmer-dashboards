import React from "react";
import { Icon } from "@/components/ui/icon";

export const SessionNotes: React.FC = () => {
  return (
    <div className="bg-surface-container-low rounded-2xl p-8 space-y-6 lg:col-span-1 flex flex-col justify-between border border-outline-variant/10 shadow-sm h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black tracking-widest text-on-surface uppercase">Operational Notes</h3>
        <button className="text-primary hover:scale-110 transition-transform">
          <Icon name="add_circle" size={20} fill />
        </button>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-inner space-y-4 border border-outline-variant/5">
        <p className="text-xs text-on-surface italic leading-relaxed font-bold">
          "Focus on explosive plyometric movements today. Remember to check floor mats in Studio A for grip quality before start."
        </p>
        <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/5">
          <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-[8px] font-black text-on-secondary-container">AR</div>
          <span className="text-[9px] text-on-surface-variant font-black uppercase tracking-widest opacity-60">Added by Alex R. • 2h ago</span>
        </div>
      </div>
      <button className="w-full text-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant py-3 border border-dashed border-outline-variant/30 rounded-xl hover:border-primary hover:text-primary transition-all">
        View All Notes (3)
      </button>
    </div>
  );
};
