import React from "react";
import { Icon } from "@/components/ui/icon";

export const TimingSettings: React.FC = () => {
  const days = [
    { label: "M", active: true },
    { label: "T", active: false },
    { label: "W", active: true },
    { label: "T", active: false },
    { label: "F", active: true },
    { label: "S", active: false },
    { label: "S", active: false },
  ];

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-atmospheric relative overflow-hidden border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon name="schedule" size={24} fill />
        </div>
        <div>
          <h2 className="text-lg font-black text-on-surface tracking-tighter">Precision Timing</h2>
          <p className="text-xs font-bold text-outline tracking-widest">Schedule & Recurrence</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-4 ml-1">Operating Days</label>
            <div className="flex flex-wrap gap-2.5">
              {days.map((day, i) => (
                <button 
                  key={i}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black transition-all active:scale-95 ${
                    day.active 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-surface-container-low/40 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-3 ml-1">Daily Time Slot</label>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-12 px-4 rounded-xl bg-surface-container-low/40 flex items-center gap-3 border border-transparent focus-within:border-primary transition-all">
                <Icon name="login" size={16} className="text-primary" />
                <input className="bg-transparent border-0 p-0 text-xs font-bold focus:ring-0 w-full text-on-surface" type="time" defaultValue="06:30" />
              </div>
              <div className="text-xs font-black text-outline tracking-widest px-1">to</div>
              <div className="flex-1 h-12 px-4 rounded-xl bg-surface-container-low/40 flex items-center gap-3 border border-transparent focus-within:border-primary transition-all">
                <Icon name="logout" size={16} className="text-tertiary" />
                <input className="bg-transparent border-0 p-0 text-xs font-bold focus:ring-0 w-full text-on-surface" type="time" defaultValue="07:30" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low/30 rounded-2xl p-6 border border-outline-variant/10 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-xs font-black text-on-surface tracking-tight">Recurring Settings</h3>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-10 h-5 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </div>
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-3 p-3.5 bg-surface-container-lowest/80 rounded-xl border border-outline-variant/5 transition-all hover:bg-white">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <Icon name="event_repeat" size={16} fill />
              </div>
              <span className="text-xs font-bold text-on-surface-variant">Repeats weekly indefinitely</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-surface-container-lowest/80 rounded-xl border border-outline-variant/5 transition-all hover:bg-white">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <Icon name="notifications_active" size={16} fill />
              </div>
              <span className="text-xs font-bold text-on-surface-variant">Send reminder 2h before start</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-outline-variant/10 relative z-10">
            <button className="text-primary text-xs font-black tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all group">
              Advanced Recurrence 
              <Icon name="arrow_forward" size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
        </div>
      </div>
    </section>
  );
};
