import React from "react";
import { Icon } from "@/components/ui/icon";

export const InvoiceHistory: React.FC = () => {
  const events = [
    { title: "Invoice Sent to Member", detail: "via Email (arjun.sharma@example.com)", date: "Oct 12 • 10:30 AM", active: true },
    { title: "Invoice Created", detail: "by System Admin (Rahul V.)", date: "Oct 12 • 10:15 AM", active: false },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Icon name="history" size={18} className="text-primary" />
        <h4 className="text-sm font-semibold text-on-surface tracking-tight">Timeline History</h4>
      </div>
      
      <div className="space-y-6 relative before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/10">
        {events.map((event, index) => (
          <div key={index} className="relative pl-9 group/event">
            <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 transition-all duration-300 z-10 ${
              event.active 
                ? 'bg-primary border-primary/20 shadow-sm' 
                : 'bg-surface-container-low border-surface-container-lowest group-hover/event:border-primary/20'
            }`}></div>
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className={`text-xs font-semibold ${event.active ? 'text-on-surface' : 'text-on-surface-variant'}`}>{event.title}</p>
                <p className="text-xs text-outline font-medium mt-1 leading-relaxed">{event.detail}</p>
              </div>
              <p className="text-xs font-semibold text-outline opacity-70 mt-0.5">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
