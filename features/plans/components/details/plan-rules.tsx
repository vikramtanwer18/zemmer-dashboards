import React from "react";
import { Icon } from "@/components/ui/icon";

export const PlanRules: React.FC = () => {
  const rules = [
    { label: "Price", value: "₹89/mo", icon: "payments" },
    { label: "Duration", value: "Monthly", icon: "schedule" },
    { label: "Freeze Rules", value: "Max 60 days/year", icon: "ac_unit" },
  ];

  const services = ["Full Gym Access", "2 Guest Passes", "Pool Access"];

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col gap-8 shadow-atmospheric border border-outline-variant/10 relative overflow-hidden group">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h3 className="text-xs font-black text-outline tracking-[0.2em]">Plan Rules</h3>
        </div>
        <div className="space-y-5">
          {rules.map((rule) => (
            <div key={rule.label} className="flex items-center justify-between group/rule">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover/rule:bg-primary group-hover/rule:text-white transition-all">
                  <Icon name={rule.icon} size={16} />
                </div>
                <span className="text-xs font-bold text-outline group-hover/rule:text-on-surface transition-colors">{rule.label}</span>
              </div>
              <span className="text-xs font-black text-on-surface">{rule.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-outline-variant/10">
        <p className="text-xs font-black text-outline tracking-[0.2em] mb-4">Included Services</p>
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <span
              key={service}
              className="px-3 py-1.5 bg-primary/5 rounded-xl text-xs font-black text-primary border border-primary/10 shadow-sm transition-all hover:bg-primary hover:text-white"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
};
