import React from "react";
import { Icon } from "@/components/ui/icon";

export const GrowthGoalCard: React.FC = () => {
  return (
    <div className="bg-on-surface p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-atmospheric h-full group">
      {/* Dynamic Background Effect */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/30 transition-all duration-500"></div>

      <div>
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
          <Icon name="trending_up" size={24} className="text-white" fill />
        </div>
        <h4 className="text-2xl font-black text-white mb-2 tracking-tighter">Growth Goal</h4>
        <p className="text-slate-400 text-sm font-medium leading-relaxed">
          Reach <span className="text-white">₹2L MRR</span> by end of Q3. You are currently at <span className="text-primary">60%</span> of this target.
        </p>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between text-[10px] font-black mb-4 tracking-[0.2em] text-slate-500">
          <span>Progress</span>
          <span className="text-white tracking-widest">₹1.2L / ₹2L</span>
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all duration-1000 relative"
            style={{ width: '60%' }}
          >
            <div className="absolute right-0 top-0 h-full w-2 bg-white/40 blur-[2px] animate-pulse"></div>
          </div>
        </div>
      </div>

      <button className="mt-10 w-full py-3.5 bg-primary text-white font-black text-xs tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95">
        Optimize Retention
      </button>
    </div>
  );
};
