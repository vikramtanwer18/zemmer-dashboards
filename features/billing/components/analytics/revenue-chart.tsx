"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Icon } from "@/components/ui/icon";

const data = [
  { name: "Jan", revenue: 4000, collections: 3200 },
  { name: "Feb", revenue: 5200, collections: 4100 },
  { name: "Mar", revenue: 4800, collections: 4500 },
  { name: "Apr", revenue: 7000, collections: 5800 },
  { name: "May", revenue: 6500, collections: 6100 },
  { name: "Jun", revenue: 8500, collections: 7200 },
  { name: "Jul", revenue: 11000, collections: 8500, isProjected: true },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-atmospheric border border-outline-variant/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h3 className="text-xl font-black text-on-surface tracking-tighter italic">Revenue vs. Collections</h3>
          <div className="flex items-center gap-6 mt-2">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-primary">
              <span className="w-3 h-1.5 rounded-full bg-primary"></span> Revenue
            </span>
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-secondary">
              <span className="w-3 h-1.5 rounded-full bg-secondary"></span> Collections
            </span>
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-outline opacity-60">
              <span className="w-3 h-[1px] border-t-2 border-dashed border-outline"></span> Forecast
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-surface-container-low hover:bg-surface-container-high rounded-xl transition-all text-primary border border-primary/5">
            <Icon name="download" size={30} />
          </button>
        </div>
      </div>

      <div className="h-[350px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#004ac6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#004ac6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
              dy={15}
            />
            <YAxis hide />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-primary/10 ring-1 ring-black/5 animate-in zoom-in-95">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Current Projection</p>
                      <p className="text-xl font-black text-primary italic leading-none">
                        ₹{(payload[0].value as number / 100).toFixed(2)}L <span className="text-xs font-bold text-on-surface-variant italic">/ mo</span>
                      </p>
                      <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden mt-3">
                        <div className="h-full bg-primary animate-pulse" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: '#004ac6', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#004ac6"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              animationDuration={2000}
            />
            <Area
              type="monotone"
              dataKey="collections"
              stroke="#495c95"
              strokeWidth={3}
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
