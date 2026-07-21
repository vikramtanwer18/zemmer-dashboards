import React from "react";
import { Icon } from "@/components/ui/icon";

export const FinancialKPIs: React.FC = () => {
  const kpis = [
    {
      title: "Monthly Recurring Revenue",
      value: "₹1.2L",
      trend: "+12%",
      icon: "account_balance_wallet",
    },
    {
      title: "Net Collections",
      value: "₹80K",
      icon: "payments",
      trend: "+8%",
    },
    {
      title: "Churn Rate",
      value: "2.4%",
      trend: "-0.2%",
      icon: "person_remove",
      isNegative: true,
    },
    {
      title: "Overdue Payments",
      value: "₹42K",
      icon: "warning",
      isUrgent: true,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {kpis.map((kpi, index) => (
        <div 
          key={index}
          className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-atmospheric group hover:border-primary/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.isUrgent ? 'bg-error/10 text-error' : 'bg-primary/5 text-primary'} transition-transform duration-300 group-hover:scale-110`}>
              <Icon name={kpi.icon} size={20} fill={kpi.isUrgent} />
            </div>
            {kpi.trend && (
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                kpi.isNegative ? 'bg-error/10 text-error' : 'bg-green-100 text-green-700'
              }`}>
                {kpi.trend}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-[0.15em]">{kpi.title}</span>
            <h2 className={`text-2xl font-black tracking-tight ${kpi.isUrgent ? 'text-error' : 'text-on-surface'}`}>
              {kpi.value}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};
