import React from "react";
import { Icon } from "@/components/ui/icon";

export const InstructorCard: React.FC = () => {
  return (
    <div className="bg-surface-container-low rounded-2xl p-8 flex flex-col justify-between border border-outline-variant/10 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black tracking-widest text-on-surface uppercase">Lead Instructor</h3>
        <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Change</button>
      </div>
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl ring-4 ring-surface/40">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover" 
            alt="Instructor" 
          />
        </div>
        <div>
          <p className="text-xl font-black text-on-surface leading-tight italic">Alex 'The Beast' Rivers</p>
          <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">Head of HIIT Programming</p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <span className="px-4 py-1.5 bg-surface-container-highest text-primary text-[9px] font-black rounded-full uppercase tracking-[0.15em] border border-primary/5 shadow-sm">Level 4 Cert</span>
        <span className="px-4 py-1.5 bg-surface-container-highest text-primary text-[9px] font-black rounded-full uppercase tracking-[0.15em] border border-primary/5 shadow-sm">CPR Certified</span>
      </div>
    </div>
  );
};
