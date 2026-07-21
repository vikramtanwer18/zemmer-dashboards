import React from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface PlanCardProps {
  name: string;
  description: string;
  price: string;
  duration: string;
  icon: string;
  tier: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  onEdit?: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  name, description, price, duration, icon, tier, isFeatured = false, isTrending = false, onEdit
}) => {
  return (
    <div className={`bg-surface-container-lowest p-8 rounded-2xl shadow-atmospheric flex flex-col h-full group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden border ${isFeatured ? 'border-primary/30 ring-1 ring-primary/10' : 'border-outline-variant/10'
      }`}>
      {isTrending && (
        <div className="absolute top-4 -right-8 bg-primary text-white text-[9px] font-black px-10 py-1.5 rotate-45 uppercase tracking-[0.2em] shadow-lg z-10">
          TRENDING
        </div>
      )}

      <div className="flex justify-between items-start mb-8">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${isFeatured ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/10 text-primary'
          }`}>
          <Icon name={icon} size={24} fill={isFeatured} />
        </div>
        <span className={`px-3 py-1 text-[9px] font-black rounded-full tracking-widest border uppercase ${isFeatured ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-container-high text-outline border-outline-variant/10'
          }`}>
          {tier}
        </span>
      </div>

      <h3 className="text-xl font-black text-on-surface tracking-tighter mb-2 group-hover:text-primary transition-colors">{name}</h3>
      <p className="text-xs text-outline leading-relaxed mb-8 font-medium">
        {description}
      </p>

      <div className="mt-auto">
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-4xl font-black text-on-surface tracking-tighter tabular-nums">
            ${price}
          </span>
          <span className="text-outline text-xs font-bold tracking-tight">/ mo</span>
        </div>

        <div className="flex items-center gap-2 mb-8 text-xs text-outline font-bold tracking-tight">
          <Icon name="schedule" size={16} className="text-primary" />
          <span>{duration}</span>
        </div>

        <Button
          variant={isFeatured ? "primary" : "outline"}
          className={`w-full h-11 text-xs font-black tracking-widest  transition-all ${isFeatured ? 'shadow-lg shadow-primary/20' : 'border-outline-variant/20 text-on-surface hover:bg-surface-container-low'
            }`}
          onClick={onEdit}
        >
          Edit Plan
        </Button>
      </div>

      {isFeatured && (
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-primary/20 transition-colors"></div>
      )}
    </div>
  );
};
