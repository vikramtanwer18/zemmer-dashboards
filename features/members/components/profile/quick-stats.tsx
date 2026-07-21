import React from "react";

export const QuickStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-primary p-6 rounded-2xl text-on-primary shadow-xl shadow-primary/25 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/20 transition-colors"></div>
        <p className="text-xs font-black tracking-widest uppercase opacity-80 mb-2 relative z-10">Total Check-ins</p>
        <p className="text-4xl font-black tracking-tighter relative z-10">142</p>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-2xl text-on-surface shadow-atmospheric border border-outline-variant/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
        <p className="text-xs font-black tracking-widest uppercase text-outline mb-2 relative z-10">Last Active</p>
        <div className="flex items-baseline gap-1 relative z-10">
          <p className="text-4xl font-black tracking-tighter">2</p>
          <p className="text-lg font-black text-outline">days</p>
        </div>
      </div>
    </div>
  );
};
