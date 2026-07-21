import React from "react";
import { Icon } from "@/components/ui/icon";

export const OverdueHeatmap: React.FC = () => {
  const plans = [
    { name: "Premium Yearly", value: "₹32,400", level: 5, color: "bg-error" },
    { name: "Standard Monthly", value: "₹12,200", level: 2, color: "bg-primary" },
    { name: "PT Packages", value: "₹8,500", level: 4, color: "bg-error/60" },
    { name: "Student Quarter", value: "₹4,200", level: 1, color: "bg-primary/40" },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col h-full border border-outline-variant/10 shadow-atmospheric">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-on-surface tracking-tighter">Overdue by Plan</h3>
        <Icon name="bar_chart" className="text-outline" size={20} />
      </div>

      <div className="space-y-6 flex-1">
        {plans.map((plan) => (
          <div key={plan.name} className="group">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">{plan.name}</span>
              <span className={`text-xs font-black ${plan.level >= 4 ? 'text-error' : 'text-primary'}`}>{plan.value}</span>
            </div>
            <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
              <div
                className={`h-full ${plan.color} rounded-full transition-all duration-1000 group-hover:opacity-80`}
                style={{ width: `${(plan.level / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 bg-primary/5 border border-primary/10 rounded-2xl relative overflow-hidden group hover:bg-primary/10 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="lightbulb" size={14} className="text-primary" fill />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase text-primary">Insight</span>
        </div>
        <p className="text-[11px] leading-relaxed text-on-surface-variant font-bold">
          Yearly plans show the highest delinquency. We recommend enabling automated SMS reminders for 30-day buckets.
        </p>
      </div>
    </div>
  );
};
