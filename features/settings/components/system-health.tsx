import React from "react";

export const SystemHealth: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-3xl shadow-sm">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <p className="text-xs font-bold text-primary">Performance Pulse</p>
        </div>
        <h4 className="text-xl font-bold tracking-tight mb-1">System Health</h4>
        <p className="text-xs text-on-surface-variant leading-relaxed mb-4 font-medium">
          All services operating at peak performance. Data sync: 0.4ms latency.
        </p>
        <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[94%] transition-all duration-1000"></div>
        </div>
      </div>
    </div>
  );
};
