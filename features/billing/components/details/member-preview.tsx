import React from "react";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export const MemberPreview: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10 group transition-all hover:border-primary/20">
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop" 
            className="w-24 h-24 rounded-3xl object-cover ring-8 ring-primary/5 shadow-xl relative z-10 transition-transform group-hover:scale-105" 
            alt="Member" 
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-surface-container-lowest rounded-full shadow-sm z-20"></div>
        </div>
        <h4 className="text-xl font-bold tracking-tight text-on-surface mb-1">Arjun Sharma</h4>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary rounded-full border border-primary/10 mb-6">
          <Icon name="workspace_premium" size={14} fill />
          <span className="text-[10px] font-bold tracking-wider uppercase">Pro Plan Member</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 py-5 border-y border-outline-variant/10">
        <div className="text-center">
          <p className="text-[10px] font-bold text-outline tracking-widest uppercase mb-1">Attendance</p>
          <p className="text-lg font-bold text-on-surface tracking-tight">85%</p>
        </div>
        <div className="text-center border-l border-outline-variant/10">
          <p className="text-[10px] font-bold text-outline tracking-widest uppercase mb-1">Renew Date</p>
          <p className="text-lg font-bold text-on-surface tracking-tight">Nov 12</p>
        </div>
      </div>
      
      <Link 
        href="/members/1"
        className="w-full mt-6 h-11 flex items-center justify-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary bg-surface-container-low hover:bg-primary/10 rounded-2xl transition-all border border-transparent hover:border-primary/20"
      >
        View Full Profile
        <Icon name="arrow_forward" size={16} />
      </Link>
    </div>
  );
};
