import React from "react";
import { Icon } from "@/components/ui/icon";

export const SchedulingStats: React.FC = () => {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-atmospheric relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-xs font-black text-outline tracking-[0.2em]">Daily Utilization</p>
          </div>
          <h4 className="text-6xl font-black text-on-surface tracking-tighter mb-4">84.2%</h4>
          <div className="flex items-center gap-2 text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="trending_up" size={18} fill />
            </div>
            <span className="text-xs font-bold">+12% vs last week</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
          <Icon name="monitoring" size={120} fill />
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-atmospheric flex flex-col justify-between group hover:border-primary/30 transition-all relative overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform relative z-10">
          <Icon name="groups" size={24} fill />
        </div>
        <div className="relative z-10">
          <p className="text-xs font-black text-outline  tracking-widest mb-1">Top Trainer</p>
          <p className="text-xl font-black text-on-surface tracking-tight">Sarah M.</p>
        </div>
        <div className="absolute bottom-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
          <Icon name="star" size={80} fill />
        </div>
      </div>

      <div className="bg-primary p-6 rounded-2xl shadow-xl shadow-primary/20 flex flex-col justify-between text-white group hover:brightness-110 transition-all relative overflow-hidden">
        <Icon name="confirmation_number" size={40} className="text-white/80 relative z-10 transition-transform group-hover:scale-110" />
        <div className="relative z-10">
          <p className="text-xs font-black tracking-widest opacity-70 mb-1">Waitlist Total</p>
          <p className="text-xl font-black tracking-tight">24 Members</p>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-[0.1] group-hover:opacity-[0.2] transition-opacity">
          <Icon name="confirmation_number" size={100} fill />
        </div>
      </div>
    </div>
  );
};
