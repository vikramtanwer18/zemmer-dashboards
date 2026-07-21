import React from "react";
import { Icon } from "@/components/ui/icon";

interface ScheduleEventProps {
  title: string;
  trainer: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  capacity?: string;
  progress?: number;
  time?: string;
  top?: string;
  height?: string;
}

export const ScheduleEvent: React.FC<ScheduleEventProps> = ({ 
  title, 
  trainer, 
  status, 
  capacity, 
  progress, 
  time,
  top = "0",
  height = "80px"
}) => {
  const styles: Record<
    ScheduleEventProps["status"],
    { bg: string; border: string; text: string; badge: string; titleClass?: string }
  > = {
    SCHEDULED: { bg: "bg-primary/5", border: "border-primary", text: "text-primary", badge: "bg-primary text-white" },
    COMPLETED: { bg: "bg-green-600/5", border: "border-green-600", text: "text-green-800", badge: "bg-green-600 text-white" },
    CANCELLED: { bg: "bg-error/5", border: "border-error", text: "text-error", badge: "bg-error text-white", titleClass: "line-through opacity-60" },
  };

  const currentStyle = styles[status];

  return (
    <div 
      className={`absolute inset-x-3 rounded-xl border-l-4 p-4 shadow-sm group cursor-pointer hover:shadow-md transition-all z-10 ${currentStyle.bg} ${currentStyle.border}`}
      style={{ top, height }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-sm font-black tracking-tight leading-none italic ${currentStyle.text} ${currentStyle.titleClass || ''}`}>
            {title}
          </h3>
          <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mt-1.5 opacity-70">
            Trainer: {trainer}
          </p>
        </div>
        <span className={`px-2.5 py-1 text-[8px] font-black rounded-full uppercase tracking-widest ${currentStyle.badge}`}>
          {status}
        </span>
      </div>

      {(capacity || time) && (
        <div className="mt-auto flex items-center justify-between pt-2">
          {capacity && (
            <div className="flex items-center gap-2">
              <Icon name="group" size={14} className={currentStyle.text} />
              <span className={`text-[10px] font-black ${currentStyle.text}`}>{capacity} Capacity</span>
            </div>
          )}
          {time && (
            <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-tighter">{time}</span>
          )}
          {progress !== undefined && (
            <div className="h-1.5 w-20 bg-surface-container-high rounded-full overflow-hidden shadow-inner">
              <div className={`h-full ${currentStyle.bg.replace('/5', '')} transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
