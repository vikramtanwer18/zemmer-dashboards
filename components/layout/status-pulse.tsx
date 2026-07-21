import React from "react";

export const StatusPulse: React.FC = () => {
  return (
    <div className="fixed bottom-8 right-8 hidden lg:block">
      <div className="bg-surface-container-lowest/80 backdrop-blur-md p-4 rounded-xl ghost-border shadow-atmospheric flex items-center gap-4 border border-primary/10">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">
            System Status
          </span>
          <span className="text-xs font-medium text-on-surface">
            Optimizing performance...
          </span>
        </div>
      </div>
    </div>
  );
};
