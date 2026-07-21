"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { FormInput, FormSelect } from "@/components/ui/form-input";
import { CustomSelect } from "@/components/ui/custom-select";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/features/members/components/pagination";
import {
  EmptyState,
  ErrorState,
  Skeleton,
} from "@/components/ui/states";
import { LeadDialog } from "@/features/leads/components/lead-dialog";
import { LeadsBoard } from "@/features/leads/components/leads-board";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteLead,
  fetchLeads,
  fetchUpcomingFollowups,
} from "@/store/slices/leads.slice";
import type {
  Lead,
  LeadSource,
  LeadStage,
} from "@/lib/api/domain-types";
import { formatRelative } from "@/lib/utils/format";
import { initialsFromName } from "@/lib/utils/format";

const stageColors: Record<LeadStage, string> = {
  NEW: "bg-primary/10 text-primary border-primary/20",
  CONTACTED: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  TRIAL: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  NEGOTIATION: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  WON: "bg-green-500/10 text-green-700 border-green-500/20",
  LOST: "bg-outline-variant/30 text-outline border-outline-variant/30",
};

function useDebounced<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function LeadsPage() {
  const dispatch = useAppDispatch();
  const { list, listLoading, listError, page, limit, total, totalPages } =
    useAppSelector((s) => s.leads);
  const followups = useAppSelector((s) => s.leads.upcomingFollowups);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<LeadStage | "">("");
  const [source, setSource] = useState<LeadSource | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<"list" | "board">("list");

  const debouncedSearch = useDebounced(search);

  const query = useMemo(
    () =>
      view === "board"
        ? {
          page: 1,
          // Board needs all leads at once for drag/drop across stages
          limit: 200,
          // Stage filter is irrelevant in the board (it's the column axis)
          stage: undefined,
          source: source || undefined,
          search: debouncedSearch || undefined,
        }
        : {
          page: currentPage,
          limit: 20,
          stage: stage || undefined,
          source: source || undefined,
          search: debouncedSearch || undefined,
        },
    [view, currentPage, stage, source, debouncedSearch],
  );

  useEffect(() => {
    dispatch(fetchLeads(query));
  }, [dispatch, query]);

  useEffect(() => {
    dispatch(fetchUpcomingFollowups({ days: 7 }));
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, stage, source]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (l: Lead) => {
    setEditing(l);
    setDialogOpen(true);
  };
  const handleDelete = (l: Lead) => {
    setLeadToDelete(l);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!leadToDelete) return;
    const action = await dispatch(deleteLead(leadToDelete.id));
    if (deleteLead.fulfilled.match(action)) {
      toast.success("Lead deleted");
    } else {
      toast.error((action.payload as string) ?? "Unable to delete lead");
    }
    setDeleteConfirmOpen(false);
    setLeadToDelete(null);
  };

  return (
    <div className="p-8 pb-12 max-w-[1600px] mx-auto min-h-screen space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tighter mb-1">
            Leads
          </h2>
          <p className="text-sm text-outline font-medium">
            Track prospects through your sales pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${view === "list"
                  ? "bg-surface-container-lowest shadow-sm text-primary"
                  : "text-on-surface-variant hover:text-primary"
                }`}
              aria-pressed={view === "list"}
            >
              <Icon name="view_list" size={14} />
              List
            </button>
            <button
              type="button"
              onClick={() => setView("board")}
              className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${view === "board"
                  ? "bg-surface-container-lowest shadow-sm text-primary"
                  : "text-on-surface-variant hover:text-primary"
                }`}
              aria-pressed={view === "board"}
            >
              <Icon name="view_kanban" size={14} />
              Board
            </button>
          </div>
          <Button
            variant="primary"
            className="h-11 max-w-[200px] px-6 text-xs shadow-lg shadow-primary/20"
            onClick={openCreate}
          >
            <Icon name="add_circle" size={18} />
            New Lead
          </Button>
        </div>
      </div>

      {followups.length > 0 && (
        <div className="bg-tertiary-container/20 rounded-2xl border border-tertiary/20 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-tertiary/20 text-tertiary flex items-center justify-center">
            <Icon name="schedule" size={20} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-on-surface">
              {followups.length} follow-up{followups.length > 1 ? "s" : ""} this week
            </p>
            <p className="text-xs text-outline">
              Next: {followups[0]?.lead?.name ?? "—"} ·{" "}
              {formatRelative(followups[0]?.followup_at)}
            </p>
          </div>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-atmospheric p-6">
        <div
          className={`grid grid-cols-1 gap-3 ${view === "board" ? "sm:grid-cols-2" : "sm:grid-cols-3"
            }`}
        >
          <FormInput
            icon="search"
            placeholder="Search leads"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {view === "list" && (
            <CustomSelect
              value={stage}
              onChange={(v) => setStage(v as LeadStage | "")}
              options={[
                { label: "All Stages", value: "" },
                { label: "New", value: "NEW" },
                { label: "Contacted", value: "CONTACTED" },
                { label: "Trial", value: "TRIAL" },
                { label: "Negotiation", value: "NEGOTIATION" },
                { label: "Won", value: "WON" },
                { label: "Lost", value: "LOST" },
              ]}
            />
          )}
          <CustomSelect
            value={source}
            onChange={(v) => setSource(v as LeadSource | "")}
            options={[
              { label: "All Sources", value: "" },
              { label: "Walk-in", value: "WALK_IN" },
              { label: "Website", value: "WEBSITE" },
              { label: "Instagram", value: "INSTAGRAM" },
              { label: "Referral", value: "REFERRAL" },
            ]}
          />
        </div>
      </div>

      {view === "board" ? (
        listError ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-atmospheric overflow-hidden">
            <ErrorState
              description={listError}
              onRetry={() => dispatch(fetchLeads(query))}
            />
          </div>
        ) : listLoading && list.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        ) : (
          <LeadsBoard leads={list} />
        )
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-atmospheric overflow-hidden">
          {listError ? (
            <ErrorState
              description={listError}
              onRetry={() => dispatch(fetchLeads(query))}
            />
          ) : listLoading && list.length === 0 ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <EmptyState
              icon="contact_phone"
              title="No leads yet"
              description="Capture your first lead to start building your pipeline."
              action={
                <button
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                >
                  <Icon name="add" size={16} />
                  New Lead
                </button>
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-surface/50 text-left border-b border-outline-variant/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Lead</th>
                      <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Source</th>
                      <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Stage</th>
                      <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Created</th>
                      <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {list.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-outline-variant/10 hover:bg-primary/[0.02] transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {initialsFromName(lead.name)}
                            </div>
                            <div>
                              <Link
                                href={`/leads/${lead.id}`}
                                className="font-semibold text-on-surface hover:text-primary transition-colors text-base"
                              >
                                {lead.name}
                              </Link>
                              <p className="text-xs text-on-surface-variant/70 font-medium mt-0.5">
                                {lead.phone}
                                {lead.email ? ` · ${lead.email}` : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium bg-surface-container-low px-2.5 py-1 rounded-md text-on-surface-variant border border-outline-variant/20 capitalize">
                            {lead.source.toLowerCase().replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${stageColors[lead.stage]}`}
                          >
                            {lead.stage}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant/70 font-medium text-sm">
                          {formatRelative(lead.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => openEdit(lead)}
                            className="inline-flex items-center text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all active:scale-95"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(lead)}
                            className="inline-flex items-center text-error hover:bg-error/10 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all active:scale-95"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {total > 0 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  limit={limit}
                  onPageChange={setCurrentPage}
                  itemLabel="leads"
                />
              )}
            </>
          )}
        </div>
      )}

      <LeadDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        lead={editing}
      />

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <Modal.Header 
          title="Delete Lead" 
          description={`Are you sure you want to delete ${leadToDelete?.name}? This action cannot be undone.`} 
        />
        <Modal.Body>
          <Modal.Footer>
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1 bg-error hover:bg-error/90 text-on-error shadow-error/20" onClick={executeDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  );
}
