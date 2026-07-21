import React from "react";
import { Icon } from "@/components/ui/icon";

export const ClassVisuals: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-atmospheric border border-outline-variant/10 group">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <h3 className="text-xs font-black text-outline tracking-[0.2em]">Class Visuals</h3>
      </div>
      
      <div className="aspect-[16/10] bg-surface-container-low/40 rounded-2xl relative cursor-pointer overflow-hidden border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-4 transition-all hover:bg-white hover:border-primary/30 shadow-inner group/upload">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale group-hover/upload:opacity-20 transition-all duration-1000" 
          alt="Preview" 
        />
        <div className="relative z-10 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-black/5 transition-transform group-hover/upload:scale-110 group-hover/upload:rotate-6">
          <Icon name="add_a_photo" size={24} className="text-primary" />
        </div>
        <div className="relative z-10 text-center">
          <p className="text-xs font-black text-on-surface tracking-widest">Upload Media</p>
          <p className="text-xs font-bold text-outline tracking-widest mt-1 opacity-60">16:10 Recommended</p>
        </div>
      </div>
    </div>
  );
};
