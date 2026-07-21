import React from "react";
import { Icon } from "@/components/ui/icon";

export const EquipmentStatus: React.FC = () => {
  return (
    <div className="flex-1 bg-surface-container-lowest rounded-2xl p-6 flex items-center justify-between border border-outline-variant/10 shadow-atmospheric group">
      <div>
        <h4 className="text-sm font-black text-on-surface uppercase tracking-tight">Equipment Status</h4>
        <p className="text-[10px] font-bold text-outline uppercase tracking-widest mt-1">98.5% Operational Efficiency</p>
      </div>
      <div className="flex gap-2 h-10 items-end">
        <div className="h-full w-2.5 bg-green-500 rounded-full shadow-sm shadow-green-500/20 group-hover:h-[80%] transition-all"></div>
        <div className="h-[90%] w-2.5 bg-green-500 rounded-full shadow-sm shadow-green-500/20 group-hover:h-full transition-all"></div>
        <div className="h-[75%] w-2.5 bg-green-500 rounded-full opacity-30 shadow-sm transition-all group-hover:opacity-50"></div>
        <div className="h-full w-2.5 bg-primary rounded-full shadow-sm shadow-primary/20 animate-pulse"></div>
      </div>
    </div>
  );
};
