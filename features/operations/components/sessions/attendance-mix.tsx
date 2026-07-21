import React from "react";
import { Icon } from "@/components/ui/icon";

export const AttendanceMix: React.FC = () => {
  return (
    <div className="bg-surface-container-low rounded-2xl p-8 space-y-8 flex flex-col justify-between border border-outline-variant/10 shadow-sm h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black tracking-widest text-on-surface uppercase">Attendance Mix</h3>
        <Icon name="analytics" size={20} className="text-on-surface-variant opacity-60" />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-5xl font-black text-on-surface tracking-tighter italic">18</span>
        <span className="text-on-surface-variant font-bold mb-2 uppercase text-[10px] tracking-widest opacity-80">/ 25 booked</span>
      </div>
      <div className="space-y-4">
        <div className="w-full bg-surface-container-high rounded-full h-3 overflow-hidden shadow-inner">
          <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: '72%' }}></div>
        </div>
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2 text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>12 Checked-in</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-outline"></span>
            <span>6 Waiting</span>
          </div>
        </div>
      </div>
    </div>
  );
};
