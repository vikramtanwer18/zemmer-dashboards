"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import type { MemberStatus } from "@/lib/api/domain-types";

interface TableFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: MemberStatus | "";
  onStatusChange: (value: MemberStatus | "") => void;
}

const tabs: Array<{ label: string; value: MemberStatus | "" }> = [
  { label: "All", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Churned", value: "CHURNED" },
];

export const TableFilters: React.FC<TableFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
}) => {
  return (
    <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container-lowest border-b border-outline-variant/10">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-80">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            className="w-full bg-surface-container-low border-none rounded-lg py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Search by name, phone, or email..."
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
        {tabs.map((tab) => {
          const active = status === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => onStatusChange(tab.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                active
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
