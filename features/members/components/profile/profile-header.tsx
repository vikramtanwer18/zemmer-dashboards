import React from "react";
import { Icon } from "@/components/ui/icon";

interface ProfileHeaderProps {
  name: string;
  plan: string;
  expiry: string;
  status: "ACTIVE" | "INACTIVE";
  avatar: string;
  onAddMember?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  name, plan, expiry, status, avatar, onAddMember 
}) => {
  return (
    <section className="mb-10 relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mt-32 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img 
              src={avatar} 
              alt={name} 
              className="w-32 h-32 rounded-[2rem] object-cover shadow-atmospheric border-4 border-white relative z-10 transition-transform group-hover:scale-[1.02]" 
            />
            <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-lg flex items-center justify-center z-20 border border-outline-variant/10">
              <Icon name="verified" fill className="text-primary" size={20} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-black tracking-tighter text-on-surface">{name}</h2>
              <span className="px-3 py-1 bg-green-500/10 text-green-600 text-[10px] font-black tracking-widest rounded-lg border border-green-500/20">
                {status === "ACTIVE" ? "Active" : "Inactive"}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <Icon name="workspace_premium" size={16} className="text-primary" />
                <span className="text-xs font-black text-on-surface tracking-tight">{plan}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <Icon name="event_repeat" size={16} className="text-outline" />
                <span className="text-xs font-bold text-outline">Expires {expiry}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={onAddMember}
            className="h-12 px-6 bg-primary text-on-primary rounded-2xl font-black text-xs tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-95"
          >
            <Icon name="person_add" size={18} fill />
            Add Member
          </button>
          <button className="h-12 px-6 bg-surface-container-lowest text-on-surface rounded-2xl font-black text-xs tracking-widest border border-outline-variant/10 hover:bg-surface-container-low transition-all shadow-sm flex items-center gap-2 active:scale-95">
            <Icon name="send" size={18} />
            Send Link
          </button>
          <button className="h-12 px-12 bg-surface-container-lowest text-on-surface rounded-2xl font-black text-xs tracking-widest border border-outline-variant/10 hover:bg-surface-container-low transition-all shadow-sm active:scale-95">
            Freeze
          </button>
          <button className="h-12 w-12 bg-surface-container-lowest text-outline rounded-2xl border border-outline-variant/10 hover:bg-surface-container-low transition-all shadow-sm flex items-center justify-center active:scale-95">
            <Icon name="edit" size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};
