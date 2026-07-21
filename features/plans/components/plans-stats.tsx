import React from "react";
import { Icon } from "@/components/ui/icon";

export const PlansStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
      {/* Performance Insight */}
      <div className="md:col-span-8 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-atmospheric relative overflow-hidden group">
        <div className="flex justify-between items-center relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <p className="text-xs font-black text-primary tracking-[0.2em]">Performance Insight</p>
            </div>
            <h3 className="text-xl font-bold text-on-surface tracking-tight mb-1">Most Popular Tier: <span className="text-primary font-black">Pro Performance</span></h3>
            <p className="text-xs text-outline font-medium leading-relaxed">
              Grown by <span className="text-primary font-bold">12%</span> in the last 30 days. Consider a limited-time upsell campaign.
            </p>
          </div>

          <div className="hidden lg:flex items-end gap-1.5 h-12">
            {[0.2, 0.4, 1, 0.6, 0.3].map((op, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-primary transition-all duration-700 group-hover:scale-y-125"
                style={{
                  height: `${[24, 32, 48, 40, 28][i]}px`,
                  opacity: op
                }}
              />
            ))}
          </div>
        </div>

        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
      </div>

      {/* Total Active Plans */}
      <div className="md:col-span-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-atmospheric relative overflow-hidden group">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Icon name="layers" size={20} fill />
          </div>
          <p className="text-xs font-black text-outline tracking-[0.2em]">Total Active Plans</p>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-on-surface tracking-tighter">04</span>
          <span className="text-[10px] font-black text-outline tracking-widest uppercase">Active Tiers</span>
        </div>
        <div className="absolute bottom-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
          <Icon name="inventory_2" size={80} fill />
        </div>
      </div>
    </div>
  );
};
