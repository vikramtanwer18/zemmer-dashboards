"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/states";
import { useAppSelector } from "@/store/hooks";

interface StatItemProps {
  label: string;
  value: string;
  icon: string;
  variant?: "default" | "error" | "tertiary";
  loading?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  icon,
  variant = "default",
  loading,
}) => {
  const iconColors = {
    default: "bg-primary/10 text-primary",
    error: "bg-error/10 text-error",
    tertiary: "bg-tertiary/10 text-tertiary",
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-center gap-5 shadow-atmospheric border border-outline-variant/10 group hover:border-primary/20 transition-all duration-300">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColors[variant]} transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon name={icon} size={24} fill />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-outline uppercase tracking-[0.15em] mb-0.5">
          {label}
        </span>
        {loading ? (
          <Skeleton className="w-20 h-7 mt-1" />
        ) : (
          <span className="text-2xl font-black tracking-tight text-on-surface">
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

export const StatsHighlights: React.FC = () => {
  const overview = useAppSelector((s) => s.analytics.overview);
  const loading = useAppSelector((s) => s.analytics.overviewLoading);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatItem
        label="Total Members"
        value={String(overview?.members?.total ?? 0)}
        icon="group"
        loading={loading && !overview}
      />
      <StatItem
        label="Active Memberships"
        value={String(overview?.memberships?.active ?? 0)}
        icon="card_membership"
        loading={loading && !overview}
      />
      <StatItem
        label="Expiring Soon"
        value={String(overview?.memberships?.expiringSoon ?? 0)}
        variant="tertiary"
        icon="schedule"
        loading={loading && !overview}
      />
      <StatItem
        label="Churned / mo"
        value={String(overview?.members?.churnedThisMonth ?? 0)}
        variant="error"
        icon="person_remove"
        loading={loading && !overview}
      />
    </div>
  );
};
