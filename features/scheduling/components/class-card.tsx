import React from "react";
import { Icon } from "@/components/ui/icon";

interface ClassCardProps {
  title: string;
  time: string;
  capacity: string;
  currentCapacity: number;
  maxCapacity: number;
  trainerName: string;
  trainerAvatar: string;
  image: string;
  tag: string;
  tagColor?: string;
  isFull?: boolean;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  title, time, capacity, currentCapacity, maxCapacity, trainerName, trainerAvatar, image, tag, isFull = false
}) => {
  const progress = (currentCapacity / maxCapacity) * 100;

  return (
    <div className="group relative bg-surface-container-lowest rounded-2xl overflow-hidden shadow-atmospheric border border-outline-variant/10 transition-all duration-500 hover:-translate-y-2">
      <div className="h-40 relative overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={image}
          alt={title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent"></div>

        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md border ${isFull ? 'bg-error/10 text-error border-error/20' : 'bg-green-500/10 text-green-500 border-primary/20'
          }`}>
          {!isFull && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
          <span className="text-xs font-black tracking-widest">{tag}</span>
        </div>

        <div className="absolute bottom-4 left-6">
          <h3 className="text-2xl font-black text-on-surface tracking-tighter">{title}</h3>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="schedule" size={18} fill />
            </div>
            <span className="text-xs font-black tracking-tight">{time}</span>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-black text-outline  tracking-widest mb-1">Utilization</p>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-black tracking-tight ${isFull ? 'text-error' : 'text-on-surface'}`}>{capacity}</span>
              <div className="w-12 h-1.5 bg-surface-container-low rounded-full overflow-hidden hidden sm:block">
                <div
                  className={`h-full transition-all duration-700 ${isFull ? 'bg-error' : 'bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]'}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                className="w-10 h-10 rounded-xl border border-outline-variant/10 shadow-sm object-cover transition-transform group-hover:scale-110"
                src={trainerAvatar}
                alt={trainerName}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white">
                <Icon name="star" size={8} fill />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black text-outline tracking-widest leading-none mb-1">Trainer</p>
              <p className="text-sm font-black text-on-surface tracking-tight">{trainerName}</p>
            </div>
          </div>

          <button className="h-9 px-4 rounded-xl border border-outline-variant/20 text-xs font-black text-outline tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95">
            Manage
          </button>
        </div>
      </div>

      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
          <Icon name="more_vert" size={18} />
        </div>
      </div>
    </div>
  );
};
