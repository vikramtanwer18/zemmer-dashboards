import React from "react";
import { ScheduleEvent } from "./schedule-event";

export const TimelineView: React.FC = () => {
  const hours = [
    { label: "6 AM", event: { title: "HIIT Cardio Burn", trainer: "Marco Rossi", status: "SCHEDULED" as const, capacity: "18/20", progress: 90 } },
    { label: "7 AM" },
    { label: "8 AM", event: { title: "Sunrise Yoga Flow", trainer: "Sarah Chen", status: "COMPLETED" as const, capacity: "12/12", time: "8:15 AM - 9:30 AM", top: "15px", height: "120px" } },
    { label: "9 AM" },
    { label: "10 AM", event: { title: "Power Lifting Basics", trainer: "Unavailable", status: "CANCELLED" as const, height: "65px" } },
    { label: "11 AM" },
    { label: "12 PM", event: { title: "Personal Training: John D.", trainer: "Alex Strong", status: "SCHEDULED" as const } },
    { label: "1 PM" },
    { label: "2 PM" },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-3xl relative overflow-hidden shadow-atmospheric border border-outline-variant/10">
      <div className="relative flex flex-col pt-8 pb-12">
        {hours.map((hour, idx) => (
          <div key={idx} className="flex min-h-[120px] border-b border-outline-variant/5 last:border-b-0">
            <div className="w-24 pr-8 text-right text-[10px] font-black text-outline uppercase self-start py-3 tracking-[0.2em]">
              {hour.label}
            </div>
            <div className="flex-1 relative p-2 border-l border-outline-variant/5">
              {hour.event && (
                <ScheduleEvent 
                  {...hour.event}
                />
              )}
            </div>
          </div>
        ))}

        {/* Floating Current Time Indicator */}
        <div className="absolute left-0 right-0 top-[400px] z-20 pointer-events-none group">
          <div className="relative w-full border-t-2 border-primary/30 border-dashed">
            <div className="absolute -top-3.5 left-20 bg-primary text-on-primary text-[10px] font-black px-4 py-2 rounded-xl shadow-lg shadow-primary/30 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              9:42 AM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
