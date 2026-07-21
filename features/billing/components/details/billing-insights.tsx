import React from "react";
import { Icon } from "@/components/ui/icon";

export const BillingInsights: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10 group relative overflow-hidden transition-all hover:border-primary/20">
      <div className="flex items-center gap-2.5 mb-6 px-1">
        <Icon name="auto_awesome" size={18} className="text-primary" />
        <h5 className="text-sm font-bold text-on-surface tracking-tight">Intelligence Insights</h5>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low/50 border border-outline-variant/5">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Icon name="insights" size={24} fill />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface tracking-tight">Spending Analysis</p>
            <p className="text-sm text-primary font-bold tracking-tight">15% Higher Average</p>
          </div>
        </div>
        
        <p className="text-sm text-on-surface-variant/80 leading-relaxed font-medium px-1">
          Arjun's spending is <span className="text-primary font-bold">15% higher</span> than his average due to the Personal Training sessions added this month.
        </p>
        
        {/* Modern Bar Chart Visualization */}
        <div className="mt-8 px-1">
          <div className="flex items-end gap-2 h-12">
            <div className="flex-1 bg-primary/10 rounded-t-md h-[40%] transition-all duration-700 group-hover:h-[60%]"></div>
            <div className="flex-1 bg-primary/10 rounded-t-md h-[60%] transition-all duration-700 group-hover:h-[40%]"></div>
            <div className="flex-1 bg-primary/10 rounded-t-md h-[30%] transition-all duration-700 group-hover:h-[70%]"></div>
            <div className="flex-1 bg-primary/30 rounded-t-md h-[70%] transition-all duration-700 group-hover:h-[50%]"></div>
            <div className="flex-1 bg-primary rounded-t-md h-full"></div>
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-outline uppercase tracking-widest px-0.5">
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
    </div>
  );
};
