import React from "react";
import { Icon } from "@/components/ui/icon";

export const StaffStatus: React.FC = () => {
  const staff = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
  ];

  return (
    <div className="flex-1 bg-surface-container-lowest rounded-2xl p-6 flex items-center justify-between border border-outline-variant/10 shadow-atmospheric group">
      <div className="flex items-center gap-5">
        <div className="flex -space-x-3">
          {staff.map((url, i) => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-surface-container-lowest overflow-hidden shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-6">
              <img src={url} className="w-full h-full object-cover" alt="Staff" />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-surface-container-high flex items-center justify-center text-[10px] font-black text-on-surface-variant shadow-sm">+4</div>
        </div>
        <div>
          <h4 className="text-sm font-black text-on-surface uppercase tracking-tight">Staff on Duty</h4>
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest mt-1">7 Team Members Active</p>
        </div>
      </div>
      <button className="text-primary text-[10px] font-black uppercase tracking-[0.15em] hover:bg-primary/5 px-4 py-2 rounded-lg transition-all active:scale-95">
        Manage Shifts
      </button>
    </div>
  );
};
