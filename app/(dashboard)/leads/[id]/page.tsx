"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/ui/form-input";
import {
  ErrorState,
  PageLoader,
  Skeleton,
} from "@/components/ui/states";
import { Modal } from "@/components/ui/modal";
import { LeadDialog } from "@/features/leads/components/lead-dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addLeadActivity,
  changeLeadStage,
  convertLead,
  createFollowup,
  deleteFollowup,
  deleteLead,
  fetchLeadActivities,
  fetchLeadById,
  updateFollowup,
} from "@/store/slices/leads.slice";
import type {
  Lead,
  LeadActivityType,
  LeadStage,
} from "@/lib/api/domain-types";
import { formatDateTime, formatRelative, initialsFromName } from "@/lib/utils/format";
import { followupSchema, type FollowupInput } from "@/lib/validators/leads";

const stages: LeadStage[] = [
  "NEW",
  "CONTACTED",
  "TRIAL",
  "NEGOTIATION",
  "WON",
  "LOST",
];

const stageColors: Record<LeadStage, string> = {
  NEW: "bg-primary/10 text-primary border-primary/20",
  CONTACTED: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  TRIAL: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  NEGOTIATION: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  WON: "bg-green-500/10 text-green-700 border-green-500/20",
  LOST: "bg-outline-variant/30 text-outline border-outline-variant/30",
};

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const lead = useAppSelector((s) => s.leads.current);
  const loading = useAppSelector((s) => s.leads.detailLoading);
  const error = useAppSelector((s) => s.leads.detailError);
  const activities = useAppSelector((s) => s.leads.activities);
  const activitiesLoading = useAppSelector(
    (s) => s.leads.activitiesLoading,
  );

  const [editOpen, setEditOpen] = useState(false);
  const [changingStage, setChangingStage] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [convertConfirmOpen, setConvertConfirmOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchLeadById(id));
    dispatch(fetchLeadActivities(id));
  }, [dispatch, id]);

  if (!id) return null;
  if (loading && !lead) return <PageLoader label="Loading lead…" />;
  if (error && !lead) {
    return (
      <ErrorState
        title="Couldn't load lead"
        description={error}
        onRetry={() => dispatch(fetchLeadById(id))}
      />
    );
  }
  if (!lead) return null;

  const handleStageChange = async (next: LeadStage) => {
    if (next === lead.stage) return;
    setChangingStage(true);
    const action = await dispatch(
      changeLeadStage({ id: lead.id, stage: next }),
    );
    setChangingStage(false);
    if (changeLeadStage.fulfilled.match(action)) {
      toast.success(`Stage: ${next}`);
      dispatch(fetchLeadActivities(lead.id));
    } else {
      toast.error((action.payload as string) ?? "Unable to change stage");
    }
  };

  const handleConvertClick = () => setConvertConfirmOpen(true);

  const executeConvert = async () => {
    const action = await dispatch(convertLead({ id: lead.id }));
    if (convertLead.fulfilled.match(action)) {
      toast.success("Lead converted");
      router.push(`/members/${action.payload.member.id}`);
    } else {
      toast.error((action.payload as string) ?? "Unable to convert lead");
    }
    setConvertConfirmOpen(false);
  };

  const handleDeleteClick = () => setDeleteConfirmOpen(true);

  const executeDelete = async () => {
    const action = await dispatch(deleteLead(lead.id));
    if (deleteLead.fulfilled.match(action)) {
      toast.success("Lead deleted");
      router.replace("/leads");
    } else {
      toast.error((action.payload as string) ?? "Unable to delete lead");
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <div className="p-8 pb-12 max-w-[1400px] mx-auto min-h-screen space-y-8">
      <nav className="flex items-center text-xs text-outline font-medium">
        <Link href="/leads" className="hover:text-primary transition-colors">
          Leads
        </Link>
        <Icon name="chevron_right" size={14} className="mx-1 opacity-50" />
        <span className="text-on-surface font-bold">{lead.name}</span>
      </nav>

      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-atmospheric p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-2xl">
            {initialsFromName(lead.name)}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black tracking-tighter text-on-surface">
                {lead.name}
              </h1>
              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${stageColors[lead.stage]}`}
              >
                {lead.stage}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
                {lead.source.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm text-outline mt-2 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="call" size={14} />
                {lead.phone}
              </span>
              {lead.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="mail" size={14} />
                  {lead.email}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Icon name="schedule" size={14} />
                Created {formatRelative(lead.createdAt)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            className="h-11 w-auto px-4 text-xs"
            onClick={() => setEditOpen(true)}
          >
            <Icon name="edit" size={16} />
            Edit
          </Button>
          <Button
            variant="primary"
            className="h-11 w-auto px-4 text-xs"
            onClick={handleConvertClick}
            disabled={lead.stage === "WON" || lead.stage === "LOST"}
          >
            <Icon name="how_to_reg" size={16} />
            Convert
          </Button>
          <Button
            variant="danger"
            className="h-11 w-11 text-xs px-0"
            onClick={handleDeleteClick}
          >
            <Icon name="delete" size={16} />
          </Button>
        </div>
      </section>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-atmospheric p-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-4">
          Pipeline Stage
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {stages.map((stage) => {
            const active = stage === lead.stage;
            return (
              <button
                key={stage}
                onClick={() => handleStageChange(stage)}
                disabled={changingStage || active}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${
                  active
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-surface-container-low text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-high"
                } disabled:opacity-60`}
              >
                {stage}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <AddActivityCard leadId={lead.id} />
          <ActivityTimeline
            loading={activitiesLoading}
            activities={activities}
          />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <FollowUpsCard lead={lead} />
          {lead.notes && (
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-atmospheric">
              <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3">
                Notes
              </h3>
              <p className="text-sm text-on-surface-variant whitespace-pre-wrap">
                {lead.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      <LeadDialog
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        lead={lead}
      />

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <Modal.Header 
          title="Delete Lead" 
          description={`Are you sure you want to delete ${lead.name}? This action cannot be undone.`} 
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

      <Modal isOpen={convertConfirmOpen} onClose={() => setConvertConfirmOpen(false)}>
        <Modal.Header 
          title="Convert Lead" 
          description={`Are you sure you want to convert ${lead.name} to a member? This cannot be undone.`} 
        />
        <Modal.Body>
          <Modal.Footer>
            <Button variant="outline" className="flex-1" onClick={() => setConvertConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1 gap-2 shadow-primary/20" onClick={executeConvert}>
              <Icon name="how_to_reg" size={18} />
              Convert to Member
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  );
}

function AddActivityCard({ leadId }: { leadId: string }) {
  const dispatch = useAppDispatch();
  const [type, setType] = useState<LeadActivityType>("NOTE");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    const action = await dispatch(
      addLeadActivity({
        leadId,
        type,
        payload: type === "CALL" ? { outcome: text } : { note: text },
      }),
    );
    setSaving(false);
    if (addLeadActivity.fulfilled.match(action)) {
      toast.success("Activity logged");
      setText("");
    } else {
      toast.error((action.payload as string) ?? "Unable to log activity");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-atmospheric space-y-4"
    >
      <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant">
        Log Activity
      </h3>
      <FormSelect
        value={type}
        onChange={(e) => setType(e.target.value as LeadActivityType)}
        options={[
          { label: "Note", value: "NOTE" },
          { label: "Call", value: "CALL" },
        ]}
      />
      <FormTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          type === "CALL"
            ? "Call outcome and next steps"
            : "What did you discuss?"
        }
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          className="w-auto h-10 px-4 text-xs"
          loading={saving}
          disabled={!text.trim()}
        >
          <Icon name="send" size={16} />
          Log
        </Button>
      </div>
    </form>
  );
}

function ActivityTimeline({
  activities,
  loading,
}: {
  activities: Array<{
    id: string;
    type: LeadActivityType;
    payload?: Record<string, unknown>;
    createdAt: string;
  }>;
  loading: boolean;
}) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-atmospheric">
      <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-4">
        Timeline
      </h3>
      {loading && activities.length === 0 ? (
        <Skeleton className="h-24" />
      ) : activities.length === 0 ? (
        <p className="text-sm text-outline italic">No activity yet.</p>
      ) : (
        <ol className="space-y-4">
          {activities.map((a) => {
            const note =
              (a.payload?.note as string | undefined) ??
              (a.payload?.outcome as string | undefined) ??
              "";
            return (
              <li key={a.id} className="flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon
                    name={
                      a.type === "CALL"
                        ? "call"
                        : a.type === "STAGE_CHANGE"
                          ? "flag"
                          : a.type === "CONVERTED"
                            ? "how_to_reg"
                            : "sticky_note_2"
                    }
                    size={18}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black uppercase tracking-widest text-outline">
                    {a.type} · {formatRelative(a.createdAt)}
                  </p>
                  {note && (
                    <p className="text-sm text-on-surface mt-1 whitespace-pre-wrap">
                      {note}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function FollowUpsCard({ lead }: { lead: Lead }) {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FollowupInput>({
    resolver: zodResolver(followupSchema),
    defaultValues: { followup_at: "", note: "" },
  });

  const [deleteFollowupId, setDeleteFollowupId] = useState<string | null>(null);

  const existing = lead.followups ?? [];

  const submit = async (values: FollowupInput) => {
    const action = await dispatch(
      createFollowup({
        leadId: lead.id,
        followup_at: new Date(values.followup_at).toISOString(),
        note: values.note || undefined,
      }),
    );
    if (createFollowup.fulfilled.match(action)) {
      toast.success("Follow-up scheduled");
      reset();
      dispatch(fetchLeadById(lead.id));
    } else {
      toast.error((action.payload as string) ?? "Unable to schedule");
    }
  };

  const toggleDone = async (fid: string, done: boolean) => {
    const action = await dispatch(
      updateFollowup({ id: fid, patch: { is_done: done } }),
    );
    if (updateFollowup.fulfilled.match(action)) {
      dispatch(fetchLeadById(lead.id));
    } else {
      toast.error((action.payload as string) ?? "Unable to update");
    }
  };

  const executeRemoveFollowup = async () => {
    if (!deleteFollowupId) return;
    const action = await dispatch(deleteFollowup(deleteFollowupId));
    if (deleteFollowup.fulfilled.match(action)) {
      dispatch(fetchLeadById(lead.id));
    } else {
      toast.error((action.payload as string) ?? "Unable to delete");
    }
    setDeleteFollowupId(null);
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-atmospheric space-y-4">
      <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant">
        Follow-ups
      </h3>

      {existing.length === 0 ? (
        <p className="text-sm text-outline italic">None scheduled.</p>
      ) : (
        <ul className="space-y-2">
          {existing.map((f) => (
            <li
              key={f.id}
              className="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg"
            >
              <input
                type="checkbox"
                checked={f.is_done}
                onChange={(e) => toggleDone(f.id, e.target.checked)}
                className="w-4 h-4 mt-1 accent-primary"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-bold ${f.is_done ? "line-through text-outline" : "text-on-surface"}`}
                >
                  {formatDateTime(f.followup_at)}
                </p>
                {f.note && (
                  <p className="text-xs text-outline mt-1">{f.note}</p>
                )}
              </div>
              <button
                onClick={() => setDeleteFollowupId(f.id)}
                className="text-error hover:text-error/80"
                aria-label="Delete follow-up"
              >
                <Icon name="delete" size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit(submit)} className="space-y-3 pt-2 border-t border-outline-variant/10">
        <FormInput
          label="Schedule"
          type="datetime-local"
          error={errors.followup_at?.message}
          {...register("followup_at")}
        />
        <FormInput
          placeholder="Note (optional)"
          error={errors.note?.message}
          {...register("note")}
        />
        <Button
          type="submit"
          variant="outline"
          className="h-10 text-xs"
          loading={isSubmitting}
        >
          <Icon name="schedule_send" size={16} />
          Schedule Follow-up
        </Button>
      </form>

      <Modal isOpen={!!deleteFollowupId} onClose={() => setDeleteFollowupId(null)}>
        <Modal.Header 
          title="Delete Follow-up" 
          description="Are you sure you want to delete this follow-up?" 
        />
        <Modal.Body>
          <Modal.Footer>
            <Button variant="outline" className="flex-1" onClick={() => setDeleteFollowupId(null)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1 bg-error hover:bg-error/90 text-on-error shadow-error/20" onClick={executeRemoveFollowup}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  );
}
