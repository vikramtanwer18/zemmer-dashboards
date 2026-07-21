import React from "react";
import { Icon } from "@/components/ui/icon";

export const NetworkPulse: React.FC = () => {
  return (
    <div className="fixed bottom-20 right-12 hidden lg:block">
      <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-2xl overflow-hidden p-1 shadow-2xl w-[280px] ghost-border">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="pulse_alert" fill className="text-primary" size={18} />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Network Pulse
            </span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="bg-primary h-full w-3/4 rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-medium text-on-surface/40">Active Nodes: 1,402</span>
            <span className="text-[10px] font-bold text-primary">Stable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
