import React from "react";
import { Icon } from "@/components/ui/icon";

export const ClassIdentityForm: React.FC = () => {
  return (
    <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-atmospheric relative overflow-hidden border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon name="edit_note" size={24} fill />
        </div>
        <div>
          <h2 className="text-lg font-black text-on-surface tracking-tighter">Class Identity</h2>
          <p className="text-xs font-bold text-outline tracking-widest">Basic Details</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">Class Name</label>
          <input 
            className="w-full h-12 px-4 rounded-xl bg-surface-container-low/40 border border-transparent focus:bg-surface-container-lowest focus:border-primary transition-all outline-none font-medium text-sm text-on-surface" 
            placeholder="e.g., CrossFit Alpha Performance" 
            type="text"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">Trainer Selection</label>
          <div className="relative">
            <select className="w-full h-12 px-4 rounded-xl bg-surface-container-low/40 border border-transparent focus:bg-surface-container-lowest focus:border-primary transition-all outline-none appearance-none font-medium text-sm text-on-surface">
              <option>Select Lead Trainer</option>
              <option>Marcus Rodriguez</option>
              <option>Sarah Chen</option>
              <option>David 'Tank' Miller</option>
            </select>
            <Icon name="expand_more" size={20} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1">Max Capacity</label>
          <div className="relative group">
            <Icon name="group" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input 
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-container-low/40 border border-transparent focus:bg-surface-container-lowest focus:border-primary transition-all outline-none font-medium text-sm text-on-surface" 
              type="number" 
              defaultValue="24"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
