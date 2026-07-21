import React from "react";
import { Icon } from "@/components/ui/icon";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Global Analytics</h1>
          <p className="text-on-surface-variant text-sm mt-1">Real-time network usage and engagement metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl border ghost-border">
          <button className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold shadow-md">Live</button>
          <button className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface text-xs font-bold transition-all">Historical</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-2xl border ghost-border shadow-atmospheric relative overflow-hidden">
            <div className="absolute top-6 right-6">
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 1,402 Online
               </div>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-8">Engagement Index</h3>
            <div className="h-72 w-full flex flex-col items-center justify-center border border-dashed border-outline-variant rounded-xl bg-surface-container-low/20 relative group">
               <Icon name="monitoring" size={48} className="text-outline-variant group-hover:text-primary/30 transition-colors" />
               <p className="mt-4 text-[10px] text-outline font-bold uppercase tracking-widest">Interaction Density Map</p>
               
               <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary/40 rounded-full blur-sm" />
               <div className="absolute bottom-1/3 right-1/2 w-6 h-6 bg-secondary/20 rounded-full blur-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border ghost-border shadow-atmospheric">
              <h4 className="text-xs font-bold text-on-surface mb-4 uppercase tracking-widest flex items-center gap-2">
                <Icon name="speed" size={16} className="text-primary" />
                System Health
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Latency', value: '142ms', status: 'optimal' },
                  { label: 'Load', value: '12%', status: 'optimal' },
                  { label: 'Cache', value: '94%', status: 'optimal' },
                ].map((metric, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant font-medium">{metric.label}</span>
                    <span className="text-xs font-bold text-on-surface">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border ghost-border shadow-atmospheric">
              <h4 className="text-xs font-bold text-on-surface mb-4 uppercase tracking-widest flex items-center gap-2">
                <Icon name="devices" size={16} className="text-secondary" />
                Devices
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Mobile', value: '64%', color: 'bg-primary' },
                  { label: 'Desktop', value: '36%', color: 'bg-secondary' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-outline mb-1.5">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full`} style={{ width: item.value }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-on-surface p-8 rounded-2xl text-surface shadow-atmospheric">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-surface/50">Top Regions</h3>
            <div className="space-y-6">
              {[
                { region: 'North America', growth: '+12%', color: 'bg-primary' },
                { region: 'Europe', growth: '+8%', color: 'bg-secondary' },
                { region: 'Asia Pacific', growth: '+24%', color: 'bg-tertiary' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${item.color}/10 flex items-center justify-center border border-white/10`}>
                      <span className="text-[10px] font-black text-white">{i+1}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{item.region}</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400">{item.growth}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
              Detailed Geo Report
            </button>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-2xl border ghost-border shadow-atmospheric text-center">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="auto_awesome" size={28} className="text-primary" />
            </div>
            <h3 className="text-sm font-bold text-on-surface">Predictive Insight</h3>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              Subscription trends indicate a 15% growth potential in high-tier memberships for Q3.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
