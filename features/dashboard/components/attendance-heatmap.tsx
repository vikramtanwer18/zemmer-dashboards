import React from "react";
import { Icon } from "@/components/ui/icon";

export const AttendanceHeatmap: React.FC = () => {
  const data = [
    { time: "06:00", percentage: "90%" },
    { time: "10:00", percentage: "40%" },
    { time: "17:00", percentage: "100%" },
    { time: "21:00", percentage: "25%" },
  ];

  return (
    <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between border border-outline-variant/10">
      <div>
        <h4 className="text-lg font-bold tracking-tight text-on-surface">Attendance Heatmap</h4>
        <p className="text-sm text-outline mb-6">Busiest hours today</p>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.time} className="flex items-center gap-3">
              <span className="text-[10px] font-bold w-12 text-outline">{item.time}</span>
              <div className="h-2 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: item.percentage }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-2">
          <Icon name="campaign" className="text-primary" size={20} />
          <span className="text-xs font-bold text-on-surface">Active Promo</span>
        </div>
        <p className="text-[11px] text-outline leading-relaxed">
          "Monsoon Madness" referral code is currently being used by 12 leads.
        </p>
      </div>
    </div>
  );
};
