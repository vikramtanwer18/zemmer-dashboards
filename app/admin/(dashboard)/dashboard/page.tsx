"use client";

import React, { useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminOverview } from "@/store/slices/adminAnalytics.slice";
import { PageLoader } from "@/components/ui/states";

const StatCard = ({ title, value, change, icon, color }: any) => (
  <div className="bg-surface-container-lowest p-6 rounded-2xl border ghost-border shadow-atmospheric group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center text-white shadow-lg shadow-current/10`}>
        <Icon name={icon} fill size={22} />
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${change?.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">{title}</h3>
    <p className="text-2xl font-bold text-on-surface mt-1">{value}</p>
  </div>
);

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { overview, loading } = useAppSelector((state) => state.adminAnalytics);

  useEffect(() => {
    dispatch(fetchAdminOverview());
  }, [dispatch]);

  if (loading && !overview) return <PageLoader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">System Overview</h1>
          <p className="text-on-surface-variant text-sm mt-1">Global performance metrics for GymOS Network.</p>
        </div>
        <button className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
          <Icon name="download" size={18} />
          Network Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overview?.stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-2xl border ghost-border shadow-atmospheric">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-on-surface">Revenue Growth</h2>
            <select className="bg-surface-container-low border-none rounded-lg px-3 py-1.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-3 px-4">
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className="w-full bg-surface-container group-hover:bg-primary/20 rounded-t-lg transition-all duration-500" 
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-primary h-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-outline uppercase">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-2xl border ghost-border shadow-atmospheric">
          <h2 className="text-lg font-bold text-on-surface mb-6">Network Activity</h2>
          <div className="space-y-6">
            {overview?.recentActivity.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon name={item.icon} size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{item.label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                  <p className="text-[10px] text-outline mt-1 uppercase font-bold tracking-wider">
                    {new Date(item.time).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {(!overview?.recentActivity || overview.recentActivity.length === 0) && (
              <p className="text-xs text-outline text-center py-10">No recent activity found.</p>
            )}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-dashed border-outline-variant text-outline text-xs font-bold hover:bg-surface-container-low transition-all">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
