"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", actual: 45, forecast: 48 },
  { month: "Feb", actual: 52, forecast: 50 },
  { month: "Mar", actual: 48, forecast: 55 },
  { month: "Apr", actual: 61, forecast: 58 },
  { month: "May", actual: 55, forecast: 65 },
  { month: "Jun", actual: 70, forecast: 75 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm relative border border-outline-variant/10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h4 className="text-lg font-bold tracking-tight text-on-surface">Revenue Growth</h4>
          <p className="text-sm text-outline font-medium">Performance over the last 6 months</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span className="text-xs font-medium text-outline">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border border-dashed border-primary"></span>
            <span className="text-xs font-medium text-outline">Forecast</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#004ac6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#004ac6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="rgba(115, 118, 134, 0.1)" 
            />
            <XAxis 
              dataKey="month" 
              hide 
            />
            <YAxis 
              hide 
              domain={['dataMin - 10', 'dataMax + 10']} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '12px', 
                border: '1px solid rgba(195, 198, 215, 0.3)',
                boxShadow: '0 8px 32px rgba(13, 28, 46, 0.06)'
              }}
              itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#004ac6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#chartGradient)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#004ac6"
              strokeWidth={2}
              strokeDasharray="8 4"
              fill="transparent"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Floating Performance Pulse Overlay */}
        <div className="absolute top-4 right-1/4 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-2xl z-20 border border-white/20 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-on-surface">Peak Performance</span>
          </div>
          <p className="text-[10px] text-outline mt-1 leading-tight font-medium">
            Occupancy at 88% right now.<br/>
            Class "Power Lift" starting in 15m.
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-6 px-4">
        {data.map((item) => (
          <span key={item.month} className="text-[10px] font-bold text-outline uppercase tracking-widest">
            {item.month}
          </span>
        ))}
      </div>
    </div>
  );
};
