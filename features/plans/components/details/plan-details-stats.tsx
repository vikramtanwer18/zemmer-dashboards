import React from "react";
import { Icon } from "@/components/ui/icon";

export const PlanDetailsStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Active Members */}
      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-atmospheric relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <p className="text-[10px] font-black text-outline tracking-[0.2em]">Active Members</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-black text-on-surface tracking-tighter">124</p>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+12% this month</span>
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-center text-[10px] font-bold text-outline mb-2">
              <span>Goal Progress</span>
              <span>75%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[75%] rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]"></div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
          <Icon name="groups" size={100} fill />
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-atmospheric relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <p className="text-[10px] font-black text-outline tracking-[0.2em]">Monthly Revenue</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-black text-on-surface tracking-tighter">₹1.1L</p>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Icon name="trending_up" size={18} fill />
            </div>
          </div>
          <p className="mt-8 text-[11px] text-outline font-bold flex items-center gap-1.5">
            <Icon name="payments" size={14} className="text-primary" />
            Avg. ticket size: ₹8,870
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
          <Icon name="account_balance_wallet" size={100} fill />
        </div>
      </div>

      {/* Real-time Utilization */}
      <div className="md:col-span-2 bg-primary-container p-6 rounded-2xl text-on-primary-container flex items-center justify-between shadow-xl shadow-primary/10 relative overflow-hidden group">
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md transition-transform group-hover:scale-110">
            <Icon name="bolt" size={28} fill className="text-on-primary-container" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <p className="text-xs font-black tracking-[0.2em]  opacity-70">Real-time Utilization</p>
            </div>
            <p className="text-lg font-black leading-tight tracking-tight">Plan currently represents 42% of gym traffic</p>
          </div>
        </div>
        <div className="hidden sm:block relative z-10">
          <img
            className="h-12 w-32 object-cover rounded-lg opacity-40 mix-blend-overlay grayscale brightness-200"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCirUwrhiSI5qm3iik6BBTWQ7ExSn5ZDoupyX4pSlTkitetMcQOHXOM8Efq93GhkZOn1o7s2azsThh0OiIxb7mrDZAkiBTeTTDuTmcx8bYVpPDVsLBt4-j6VFonX_8GHaVcccVyFih5LlPdQB79YXuN2L1VH7TepX3ArY4FDXa8R_rLU-a1IBVwjruZ4cfTnyP2B9pyvJGd-BpfVWVVLkDx-XoS7kFDzJgJRn_nCcRDzImjmAznKpDl2cpc0F3lsz4PxBowbgAoFt0"
            alt="Gym utilization"
          />
        </div>

        <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
          <Icon name="bolt" size={120} fill />
        </div>
      </div>
    </div>
  );
};
