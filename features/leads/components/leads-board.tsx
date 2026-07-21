"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { initialsFromName, formatRelative } from "@/lib/utils/format";
import type { Lead, LeadStage } from "@/lib/api/domain-types";
import { useAppDispatch } from "@/store/hooks";
import {
  changeLeadStage,
  optimisticallySetLeadStage,
} from "@/store/slices/leads.slice";

const STAGES: LeadStage[] = [
  "NEW",
  "CONTACTED",
  "TRIAL",
  "NEGOTIATION",
  "WON",
  "LOST",
];

const stageStyles: Record<
  LeadStage,
  { dot: string; ring: string; soft: string; label: string }
> = {
  NEW: {
    dot: "bg-primary",
    ring: "ring-primary/30",
    soft: "bg-primary/10 text-primary border-primary/20",
    label: "New",
  },
  CONTACTED: {
    dot: "bg-blue-500",
    ring: "ring-blue-400/40",
    soft: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    label: "Contacted",
  },
  TRIAL: {
    dot: "bg-purple-500",
    ring: "ring-purple-400/40",
    soft: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    label: "Trial",
  },
  NEGOTIATION: {
    dot: "bg-amber-500",
    ring: "ring-amber-400/50",
    soft: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    label: "Negotiation",
  },
  WON: {
    dot: "bg-green-600",
    ring: "ring-green-500/40",
    soft: "bg-green-500/10 text-green-700 border-green-500/20",
    label: "Won",
  },
  LOST: {
    dot: "bg-outline",
    ring: "ring-outline/40",
    soft: "bg-outline-variant/30 text-outline border-outline-variant/30",
    label: "Lost",
  },
};

const DRAG_MIME = "application/x-gymos-lead";

interface LeadsBoardProps {
  leads: Lead[];
}

export function LeadsBoard({ leads }: LeadsBoardProps) {
  const dispatch = useAppDispatch();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<LeadStage | null>(null);

  const grouped = useMemo(() => {
    const m = new Map<LeadStage, Lead[]>();
    for (const stage of STAGES) m.set(stage, []);
    for (const l of leads) {
      if (!m.has(l.stage)) m.set(l.stage, []);
      m.get(l.stage)!.push(l);
    }
    return m;
  }, [leads]);

  const handleDrop = async (stage: LeadStage, leadId: string) => {
    setDraggingId(null);
    setOverStage(null);
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage === stage) return;

    const previousStage = lead.stage;

    // Optimistic UI update
    dispatch(optimisticallySetLeadStage({ id: leadId, stage }));

    const action = await dispatch(changeLeadStage({ id: leadId, stage }));
    if (!changeLeadStage.fulfilled.match(action)) {
      // Rollback on failure
      dispatch(
        optimisticallySetLeadStage({ id: leadId, stage: previousStage }),
      );
      toast.error(
        (action.payload as string) ?? "Couldn't change stage. Reverted.",
      );
    }
  };

  return (
    <div className="overflow-x-auto no-scrollbar -mx-2 px-2 pb-4 pt-1">
      <div className="flex gap-4 min-w-max">
        {STAGES.map((stage) => (
          <Column
            key={stage}
            stage={stage}
            leads={grouped.get(stage) ?? []}
            isOver={overStage === stage}
            onDragEnter={() => setOverStage(stage)}
            onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
            onDrop={(leadId) => handleDrop(stage, leadId)}
            draggingId={draggingId}
            onDragStart={(id) => setDraggingId(id)}
            onDragEnd={() => {
              setDraggingId(null);
              setOverStage(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Column({
  stage,
  leads,
  isOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  draggingId,
  onDragStart,
  onDragEnd,
}: {
  stage: LeadStage;
  leads: Lead[];
  isOver: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: (leadId: string) => void;
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}) {
  const style = stageStyles[stage];

  return (
    <div
      className={`flex flex-col flex-shrink-0 w-[280px] rounded-2xl transition-all ${
        isOver
          ? "bg-primary/5 ring-2 ring-inset ring-primary/30"
          : "bg-surface-container-low/30 hover:bg-surface-container-low/50"
      }`}
      onDragEnter={(e) => {
        if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
        e.preventDefault();
        onDragEnter();
      }}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDragLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        onDragLeave();
      }}
      onDrop={(e) => {
        const id = e.dataTransfer.getData(DRAG_MIME);
        if (id) onDrop(id);
      }}
    >
      <div className="flex items-center justify-between px-3 py-3 mb-1">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${style.dot} shadow-sm`} />
          <h3 className="text-xs font-bold text-on-surface">
            {style.label}
          </h3>
          <span className="text-xs font-semibold text-outline ml-1">
            {leads.length}
          </span>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto no-scrollbar">
        {leads.length === 0 ? (
          <div
            className={`text-center text-[11px] italic py-8 rounded-xl border border-dashed transition-colors ${
              isOver
                ? "border-primary/40 text-primary"
                : "border-outline-variant/20 text-outline"
            }`}
          >
            {isOver ? "Drop to move here" : "No leads"}
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              isDragging={draggingId === lead.id}
              onDragStart={() => onDragStart(lead.id)}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
}

function LeadCard({
  lead,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  lead: Lead;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_MIME, lead.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`group bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] cursor-grab active:cursor-grabbing transition-all hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 ${
        isDragging ? "opacity-40 scale-[0.98] shadow-none" : "opacity-100"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
          {initialsFromName(lead.name)}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <Link
            href={`/leads/${lead.id}`}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
            className="block font-bold text-sm text-on-surface hover:text-primary transition-colors truncate"
          >
            {lead.name}
          </Link>
          <p className="text-[11px] text-outline font-medium truncate mt-0.5">{lead.phone}</p>
        </div>
        <Icon
          name="drag_indicator"
          size={16}
          className="text-outline/50 group-hover:text-outline transition-colors shrink-0 mt-1 cursor-grab"
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="px-2 py-1 rounded-md bg-surface-container-low text-[10px] text-on-surface-variant font-bold uppercase tracking-wider border border-outline-variant/10">
          {lead.source.replace("_", " ")}
        </span>
        <span className="text-[10px] text-outline font-semibold">
          {formatRelative(lead.createdAt)}
        </span>
      </div>
    </div>
  );
}
