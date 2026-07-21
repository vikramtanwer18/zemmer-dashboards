"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { useAppSelector } from "@/store/hooks";

export const AdminTopbar: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userName = user?.name || "Admin User";
  const avatarUrl = user?.avatarUrl || user?.avatar_url;

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-18rem)] h-16 z-40 bg-surface/80 backdrop-blur-md flex items-center justify-between px-8 gap-4 border-b border-outline-variant/30">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-bold text-on-surface">
          Global Administration
        </h2>
        <div className="h-4 w-[1px] bg-outline-variant mx-2" />
        <p className="text-[10px] text-outline font-bold uppercase tracking-widest">
          Network Overview
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input
            className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 w-64 focus:ring-2 focus:ring-primary text-xs text-on-surface"
            placeholder="Global Network Search..."
            type="text"
          />
        </div>

        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <Icon name="notifications" size={22} />
        </button>
        
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 active:scale-[0.95] transition-all shadow-lg shadow-primary/10">
          Admin Support
        </button>

        <div className="flex items-center gap-3 ml-2">
          <div className="hidden md:block text-right">
            <p className="text-[11px] font-bold text-on-surface leading-none">{userName}</p>
            <p className="text-[9px] text-primary font-bold mt-1 uppercase tracking-widest">System Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-container/20 cursor-pointer shadow-sm">
            {avatarUrl ? (
              <img
                alt={userName}
                className="w-full h-full object-cover"
                src={avatarUrl}
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {userName.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
