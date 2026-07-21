"use client";

import React, { useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminEarnings } from "@/store/slices/adminAnalytics.slice";
import { PageLoader } from "@/components/ui/states";

export default function AdminEarningsPage() {
  const dispatch = useAppDispatch();
  const { earnings, loading } = useAppSelector((state) => state.adminAnalytics);

  useEffect(() => {
    dispatch(fetchAdminEarnings());
  }, [dispatch]);

  if (loading && !earnings) return <PageLoader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Earnings & Payouts</h1>
          <p className="text-on-surface-variant text-sm mt-1">Platform revenue and partner compensation.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-lowest border ghost-border text-on-surface px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-surface-container-low transition-all flex items-center gap-2">
            <Icon name="calendar_today" size={18} />
            May 2026
          </button>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
            Payout Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary p-8 rounded-2xl text-white shadow-atmospheric relative overflow-hidden">
          <Icon name="account_balance_wallet" size={100} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Platform Volume</p>
          <p className="text-3xl font-black mt-2">${(earnings?.totalVolume || 0).toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mt-4 text-emerald-300 text-xs font-bold">
            <Icon name="trending_up" size={14} />
            <span>+18.4% monthly</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-2xl border ghost-border shadow-atmospheric">
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Commission (5%)</p>
          <p className="text-3xl font-bold text-on-surface mt-2">${(earnings?.commission || 0).toLocaleString()}</p>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-6 overflow-hidden">
            <div className="bg-primary h-full w-[75%]" />
          </div>
          <p className="text-[9px] text-outline font-bold uppercase mt-2 tracking-wider">75% of goal reached</p>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-2xl border ghost-border shadow-atmospheric">
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Pending Payouts</p>
          <p className="text-3xl font-bold text-on-surface mt-2">$45.2k</p>
          <button className="mt-4 text-primary text-xs font-bold hover:underline flex items-center gap-1 uppercase tracking-wider">
            Review requests <Icon name="chevron_right" size={14} />
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border ghost-border shadow-atmospheric overflow-hidden">
        <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/30">
          <h2 className="text-lg font-bold text-on-surface">Recent Transactions</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
              <input 
                type="text" 
                placeholder="Search tx..." 
                className="bg-surface-container-low border-none rounded-lg py-1.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-primary/20 outline-none w-40 text-on-surface"
              />
            </div>
            <button className="p-1.5 bg-surface-container-low text-on-surface-variant rounded-lg hover:text-primary transition-colors">
              <Icon name="filter_list" size={20} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-3 text-[10px] font-black text-outline uppercase tracking-widest">Tx ID</th>
                <th className="px-6 py-3 text-[10px] font-black text-outline uppercase tracking-widest">Gym Brand</th>
                <th className="px-6 py-3 text-[10px] font-black text-outline uppercase tracking-widest">Total</th>
                <th className="px-6 py-3 text-[10px] font-black text-outline uppercase tracking-widest">Comm.</th>
                <th className="px-6 py-3 text-[10px] font-black text-outline uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-[10px] font-black text-outline uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {earnings?.recentTransactions.map((tx: any, i: number) => (
                <tr key={i} className="hover:bg-surface-container-low/20 transition-colors">
                  <td className="px-6 py-4 text-[10px] font-mono text-outline">{tx.id.substring(0, 12)}...</td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface">{tx.gym}</td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface">{tx.amount}</td>
                  <td className="px-6 py-4 text-sm text-primary font-bold">{tx.comm}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter bg-emerald-50 text-emerald-600`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] text-outline font-bold">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!earnings?.recentTransactions || earnings.recentTransactions.length === 0) && (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-xs text-outline">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
