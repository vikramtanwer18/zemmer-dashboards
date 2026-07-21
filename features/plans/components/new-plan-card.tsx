import React from "react";
import { Icon } from "@/components/ui/icon";

export const NewPlanCard: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest border-2 border-dashed border-outline-variant/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[320px] group cursor-pointer hover:border-primary/40 transition-all duration-500 relative overflow-hidden shadow-atmospheric">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110  group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-sm z-10">
        <Icon name="add" size={32} />
      </div>
      <div className="relative z-10">
        <h4 className="text-xl font-black text-on-surface tracking-tighter mb-2">New Growth Opportunity?</h4>
        <p className="text-xs text-outline max-w-[280px] font-medium leading-relaxed">
          Design a custom tier to capture a new segment of your local market and scale your revenue.
        </p>
      </div>

      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
    </div>
  );
};
