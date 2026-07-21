"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  itemLabel = "items",
}) => {
  if (totalPages <= 0) return null;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);

  const pages = buildPageList(page, totalPages);

  return (
    <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-outline-variant/10 bg-surface-container-lowest">
      <p className="text-xs text-outline font-medium">
        Showing{" "}
        <span className="text-on-surface font-bold">
          {from}–{to}
        </span>{" "}
        of <span className="text-on-surface font-bold">{total}</span> {itemLabel}
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="p-2 rounded-lg text-outline hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <Icon name="chevron_left" size={20} />
        </button>
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`gap-${idx}`} className="text-outline px-1 text-xs">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                p === page
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-2 rounded-lg text-outline hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <Icon name="chevron_right" size={20} />
        </button>
      </div>
    </div>
  );
};

function buildPageList(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const first = 1;
  const last = total;
  const pages: Array<number | "…"> = [first];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) pages.push("…");
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < total - 1) pages.push("…");
  pages.push(last);
  return pages;
}
