import React from "react";
import { Icon } from "@/components/ui/icon";
import { formatPaise } from "@/lib/utils/format";

interface BillingStatsProps {
  outstandingPaise: number;
  pendingCount: number;
  overduePaise: number;
  recentPaise: number;
  recentCount: number;
}

export const BillingStats: React.FC<BillingStatsProps> = ({
  outstandingPaise,
  pendingCount,
  overduePaise,
  recentPaise,
  recentCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Total Outstanding */}
      <div className="bg-primary p-6 rounded-2xl text-on-primary shadow-atmospheric relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <p className="text-xs font-bold tracking-wider text-on-primary/80 uppercase mb-1">Total Outstanding</p>
            <h3 className="text-3xl font-black tracking-tight">{formatPaise(outstandingPaise)}</h3>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 bg-white/20 rounded-md">Expected this month</span>
          </div>
        </div>
        <Icon 
          name="account_balance_wallet" 
          size={120} 
          className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-105 transition-transform duration-500 pointer-events-none" 
        />
      </div>

      {/* Pending Invoices */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm relative overflow-hidden group hover:-translate-y-0.5 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center transition-transform group-hover:scale-110">
            <Icon name="schedule" size={20} fill />
          </div>
          {overduePaise > 0 && (
            <span className="text-[10px] font-bold text-error bg-error/10 px-2.5 py-1 rounded-md border border-error/10 tracking-widest uppercase">OVERDUE</span>
          )}
        </div>
        <p className="text-xs font-bold text-outline tracking-wider uppercase mb-1">Pending Invoices</p>
        <h3 className="text-3xl font-black tracking-tight text-on-surface">{pendingCount}</h3>
        {overduePaise > 0 && (
          <p className="mt-2 text-xs font-semibold text-error flex items-center gap-1.5">
            <Icon name="warning" size={14} />
            {formatPaise(overduePaise)} is overdue
          </p>
        )}
      </div>

      {/* Recent Collections */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm relative overflow-hidden group hover:-translate-y-0.5 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
            <Icon name="payments" size={20} fill />
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/10 tracking-widest uppercase">THIS MONTH</span>
        </div>
        <p className="text-xs font-bold text-outline tracking-wider uppercase mb-1">Recent Collections</p>
        <h3 className="text-3xl font-black tracking-tight text-on-surface">{formatPaise(recentPaise)}</h3>
        <p className="mt-2 text-xs font-semibold text-primary flex items-center gap-1.5">
          <Icon name="check_circle" size={14} />
          {recentCount} payments processed
        </p>
      </div>
    </div>
  );
};
