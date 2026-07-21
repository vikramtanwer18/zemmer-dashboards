import React from "react";
import { Icon } from "@/components/ui/icon";

export const PerformancePulse: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-atmospheric relative overflow-hidden border border-outline-variant/10 group">
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        <h3 className="text-xs font-black text-primary tracking-[0.2em]">Performance Pulse</h3>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-4xl font-black text-on-surface tracking-tighter">84%</span>
          <span className="text-xs font-bold text-outline">Predicted</span>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-outline tracking-widest">Estimated Revenue</span>
            <span className="text-lg font-black text-on-surface tracking-tight">₹1,420.00</span>
          </div>
          <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)] transition-all duration-1000" style={{ width: '84%' }}></div>
          </div>
          <p className="text-xs text-outline leading-relaxed font-medium pt-2">
            Based on 6:30 AM Wednesday historical data for similar High-Intensity classes.
          </p>
        </div>
      </div>

      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <Icon name="monitoring" size={80} fill />
      </div>
      
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
    </div>
  );
};
