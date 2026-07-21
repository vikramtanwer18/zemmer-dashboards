import React from "react";
import { Icon } from "@/components/ui/icon";

export const AutoCollectPulse: React.FC = () => {
  return (
    <div className="fixed bottom-8 right-8 bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/10 rounded-2xl p-4 shadow-atmospheric flex items-center gap-4 max-w-xs transition-all hover:scale-105 hover:shadow-2xl cursor-pointer z-50">
      <div className="relative h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10">
        <Icon name="bolt" size={24} fill className="text-primary" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-tertiary rounded-full border-2 border-surface-container-lowest animate-pulse"></span>
      </div>
      <div>
        <h4 className="text-sm font-bold text-on-surface">Auto-Collect Active</h4>
        <p className="text-xs text-on-surface-variant/70 font-medium leading-tight mt-0.5">12 invoices will be processed at midnight.</p>
      </div>
    </div>
  );
};
