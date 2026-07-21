import React from "react";
import { Icon } from "@/components/ui/icon";

export const RealTimeTraffic: React.FC = () => {
  const avatars = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1972&auto=format&fit=crop",
  ];

  return (
    <div className="mt-8 flex justify-end">
      <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 shadow-xl border border-white/50 group hover:bg-white/60 transition-all cursor-pointer">
        <div className="flex -space-x-3">
          {avatars.map((url, i) => (
            <img 
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white object-cover" 
              src={url}
              alt="Active member"
            />
          ))}
        </div>
        <div>
          <p className="text-xs font-black text-on-surface uppercase tracking-tight">Real-time Traffic</p>
          <p className="text-[10px] text-primary font-bold">12 Active Athletes Checking In Now</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Icon name="sensors" fill className="animate-pulse" size={24} />
        </div>
      </div>
    </div>
  );
};
