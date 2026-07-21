"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  ErrorState,
  PageLoader,
  Skeleton,
} from "@/components/ui/states";
import { FreezeDialog } from "@/features/members/components/profile/freeze-dialog";
import { AddMembershipDialog } from "@/features/members/components/profile/add-membership-dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteMember,
  fetchMemberById,
  updateMember,
} from "@/store/slices/members.slice";
import {
  fetchMemberships,
  unfreezeMembership,
} from "@/store/slices/memberships.slice";
import { fetchAttendance, checkInManual } from "@/store/slices/attendance.slice";
import { generateQrToken } from "@/store/slices/attendance.slice";
import {
  formatDate,
  formatDateTime,
  formatRelative,
  initialsFromName,
} from "@/lib/utils/format";
import type {
  Member,
  Membership,
  MembershipStatus,
} from "@/lib/api/domain-types";

const statusPill: Record<MembershipStatus, string> = {
  ACTIVE: "bg-green-500/10 text-green-700 border-green-500/20",
  FROZEN: "bg-tertiary/10 text-tertiary border-tertiary/20",
  EXPIRED: "bg-outline-variant/20 text-outline border-outline-variant/20",
  SUSPENDED: "bg-error/10 text-error border-error/20",
};

export default function MemberProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const current = useAppSelector((s) => s.members.current);
  const loading = useAppSelector((s) => s.members.detailLoading);
  const error = useAppSelector((s) => s.members.detailError);
  const memberships = useAppSelector((s) => s.memberships.list);
  const attendance = useAppSelector((s) => s.attendance.list);

  const [freezeOpen, setFreezeOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [addMembershipOpen, setAddMembershipOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchMemberById(id));
    dispatch(fetchMemberships({ member_id: id, limit: 20 }));
    dispatch(fetchAttendance({ member_id: id, limit: 10 }));
  }, [dispatch, id]);

  if (!id) return null;
  if (loading && !current) return <PageLoader label="Loading member…" />;
  if (error && !current) {
    return (
      <ErrorState
        title="Couldn't load member"
        description={error}
        onRetry={() => dispatch(fetchMemberById(id))}
      />
    );
  }
  if (!current) return null;

  const activeMembership =
    memberships.find((m) => m.status === "ACTIVE" || m.status === "FROZEN") ??
    current.memberships?.[0] ??
    null;

  const handleUnfreeze = async () => {
    if (!activeMembership) return;
    const action = await dispatch(unfreezeMembership(activeMembership.id));
    if (unfreezeMembership.fulfilled.match(action)) {
      toast.success("Membership reactivated");
    } else {
      toast.error((action.payload as string) ?? "Unable to unfreeze");
    }
  };

  const handleManualCheckIn = async () => {
    const action = await dispatch(checkInManual({ member_id: id }));
    if (checkInManual.fulfilled.match(action)) {
      toast.success("Checked in");
      dispatch(fetchAttendance({ member_id: id, limit: 10 }));
    } else {
      toast.error((action.payload as string) ?? "Check-in failed");
    }
  };

  const handleToggleStatus = async () => {
    const nextStatus = current.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const action = await dispatch(
      updateMember({ id, patch: { status: nextStatus } }),
    );
    if (updateMember.fulfilled.match(action)) {
      toast.success(`Member ${nextStatus.toLowerCase()}`);
    } else {
      toast.error((action.payload as string) ?? "Unable to update status");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${current.name}? This cannot be undone.`)) return;
    const action = await dispatch(deleteMember(id));
    if (deleteMember.fulfilled.match(action)) {
      toast.success("Member deleted");
      router.replace("/members");
    } else {
      toast.error((action.payload as string) ?? "Unable to delete member");
    }
  };

  return (
    <div className="pt-8 px-8 pb-12 max-w-[1600px] mx-auto min-h-screen">
      <ProfileHeaderBlock
        member={current}
        activeMembership={activeMembership}
        onCheckIn={handleManualCheckIn}
        onShowQr={() => setQrOpen(true)}
      />

      <div className="mt-8">
        <QuickActionsCard
          member={current}
          activeMembership={activeMembership}
          onFreeze={() => setFreezeOpen(true)}
          onUnfreeze={handleUnfreeze}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </div>

      <div className="grid grid-cols-12 gap-8 mt-8">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <ContactCard member={current} />
          <NotesCard member={current} />
        </div>
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <MembershipsCard
            memberships={memberships}
            loading={loading}
            onAddMembership={() => setAddMembershipOpen(true)}
          />
          <AttendanceCard
            attendance={attendance}
            loading={false}
          />
        </div>
      </div>

      <FreezeDialog
        isOpen={freezeOpen}
        onClose={() => setFreezeOpen(false)}
        memberName={current.name}
        membershipId={
          activeMembership && activeMembership.status === "ACTIVE"
            ? activeMembership.id
            : null
        }
      />

      <QrDialog
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        memberId={id}
        memberName={current.name}
      />

      <AddMembershipDialog
        isOpen={addMembershipOpen}
        onClose={() => setAddMembershipOpen(false)}
        memberId={id}
        memberName={current.name}
        onCreated={() =>
          dispatch(fetchMemberships({ member_id: id, limit: 20 }))
        }
      />
    </div>
  );
}

function ProfileHeaderBlock({
  member,
  activeMembership,
  onCheckIn,
  onShowQr,
}: {
  member: Member;
  activeMembership: Membership | null;
  onCheckIn: () => void;
  onShowQr: () => void;
}) {
  const isFrozen = activeMembership?.status === "FROZEN";
  return (
    <section className="relative bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-3xl pointer-events-none" />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-24 h-24 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl ring-8 ring-primary/5">
            {initialsFromName(member.name)}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold tracking-tight text-on-surface">
                {member.name}
              </h2>
              <span
                className={`px-3 py-1 text-xs font-semibold tracking-wide rounded-full border w-fit uppercase ${member.status === "ACTIVE"
                    ? "bg-green-500/10 text-green-700 border-green-500/20"
                    : "bg-outline-variant/30 text-outline border-outline-variant/30"
                  }`}
              >
                {member.status}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {activeMembership?.plan && (
                <Pill icon="workspace_premium" label={activeMembership.plan.name} />
              )}
              {activeMembership && (
                <Pill
                  icon="event"
                  label={`Expires ${formatDate(activeMembership.end_date)}`}
                  muted
                />
              )}
              <Pill icon="call" label={member.phone} muted />
              {member.email && <Pill icon="mail" label={member.email} muted />}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 lg:mt-0 shrink-0">
          <Button
            variant="primary"
            className="h-10 whitespace-nowrap px-5 text-sm rounded-xl shadow-sm hover:shadow-md transition-all font-semibold"
            onClick={onCheckIn}
          >
            <Icon name="login" size={18} className="mr-1.5" />
            Manual Check-In
          </Button>
          <Button
            variant="outline"
            className="h-10 px-5 text-sm rounded-xl font-semibold border-outline-variant/20 hover:bg-surface-container-low transition-all"
            onClick={onShowQr}
          >
            <Icon name="qr_code_2" size={18} className="mr-1.5" />
            QR Code
          </Button>
        </div>
      </div>
    </section>
  );
}

function QuickActionsCard({
  member,
  activeMembership,
  onFreeze,
  onUnfreeze,
  onToggleStatus,
  onDelete,
}: {
  member: Member;
  activeMembership: Membership | null;
  onFreeze: () => void;
  onUnfreeze: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}) {
  const isFrozen = activeMembership?.status === "FROZEN";
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10">
      <h3 className="text-sm font-bold text-on-surface-variant mb-4 uppercase tracking-widest">Quick Actions</h3>
      <div className="flex flex-col md:flex-row gap-4">
        {isFrozen ? (
          <button
            onClick={onUnfreeze}
            className="flex-1 p-4 rounded-2xl border border-outline-variant/10 hover:border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-colors text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                <Icon name="play_circle" size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-green-700">Unfreeze Membership</p>
                <p className="text-xs text-green-700/70 mt-0.5">Resume active plan</p>
              </div>
            </div>
          </button>
        ) : (
          <button
            onClick={onFreeze}
            disabled={!activeMembership || activeMembership.status !== "ACTIVE"}
            className="flex-1 p-4 rounded-2xl border border-outline-variant/10 hover:border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-colors text-left group disabled:opacity-50 disabled:hover:bg-blue-500/5 disabled:hover:border-outline-variant/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <Icon name="pause" size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-700">Freeze Membership</p>
                <p className="text-xs text-blue-700/70 mt-0.5">Pause active plan</p>
              </div>
            </div>
          </button>
        )}

        <button
          onClick={onToggleStatus}
          className={`flex-1 p-4 rounded-2xl border border-outline-variant/10 transition-colors text-left group ${
            member.status === "ACTIVE" 
              ? "hover:border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10" 
              : "hover:border-green-500/30 bg-green-500/5 hover:bg-green-500/10"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              member.status === "ACTIVE" ? "bg-orange-500/10 text-orange-600" : "bg-green-500/10 text-green-600"
            }`}>
              <Icon name={member.status === "ACTIVE" ? "cancel" : "check_circle"} size={20} />
            </div>
            <div>
              <p className={`text-sm font-bold ${member.status === "ACTIVE" ? "text-orange-700" : "text-green-700"}`}>
                {member.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
              </p>
              <p className={`text-xs mt-0.5 ${member.status === "ACTIVE" ? "text-orange-700/70" : "text-green-700/70"}`}>
                {member.status === "ACTIVE" ? "Revoke gym access" : "Restore gym access"}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={onDelete}
          className="flex-1 p-4 rounded-2xl border border-outline-variant/10 hover:border-error/30 bg-error/5 hover:bg-error/10 transition-colors text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
              <Icon name="delete" size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-error">Delete Member</p>
              <p className="text-xs text-error/70 mt-0.5">Permanently remove data</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}


function Pill({
  icon,
  label,
  muted,
}: {
  icon: string;
  label: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant/10 ${muted ? "text-outline" : "text-on-surface-variant"}`}
    >
      <Icon name={icon} size={14} className={muted ? "text-outline/70" : "text-primary"} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

function ContactCard({ member }: { member: Member }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 hover:border-outline-variant/20 transition-all">
      <h3 className="text-lg font-bold text-on-surface mb-6">Contact Info</h3>
      <dl className="space-y-2 text-sm">
        <InfoRow icon="call" label="Phone" value={member.phone} />
        <InfoRow icon="mail" label="Email" value={member.email || "—"} />
        <InfoRow icon="cake" label="DOB" value={formatDate(member.dob)} />
        <InfoRow icon="person" label="Gender" value={member.gender ?? "—"} />
        <InfoRow icon="calendar_today" label="Joined" value={formatDate(member.createdAt)} />
      </dl>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-2xl hover:bg-surface-container-low/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-outline shrink-0">
          <Icon name={icon} size={16} />
        </div>
        <dt className="text-sm font-medium text-outline">{label}</dt>
      </div>
      <dd className="text-sm font-semibold text-on-surface text-right truncate">{value || "—"}</dd>
    </div>
  );
}

function NotesCard({ member }: { member: Member }) {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(member.notes ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const action = await dispatch(
      updateMember({ id: member.id, patch: { notes: draft } }),
    );
    setSaving(false);
    if (updateMember.fulfilled.match(action)) {
      toast.success("Notes saved");
      setEditing(false);
    } else {
      toast.error((action.payload as string) ?? "Unable to save");
    }
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 hover:border-outline-variant/20 transition-all flex flex-col h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-on-surface">Internal Notes</h3>
        {!editing && (
          <button
            onClick={() => {
              setDraft(member.notes ?? "");
              setEditing(true);
            }}
            className="text-xs font-semibold text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full"
          >
            <Icon name="edit" size={14} />
            Edit
          </button>
        )}
      </div>
      {editing ? (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl text-on-surface text-sm px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none min-h-[120px] resize-y"
            placeholder="Private notes about member..."
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-outline hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary disabled:opacity-60 transition-colors hover:bg-primary/90"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-low/40 p-4 rounded-2xl border border-outline-variant/5 min-h-[100px]">
          <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
            {member.notes || (
              <span className="italic text-outline">
                No notes yet. Click Edit to add.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

function MembershipsCard({
  memberships,
  loading,
  onAddMembership,
}: {
  memberships: Membership[];
  loading: boolean;
  onAddMembership: () => void;
}) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 hover:border-outline-variant/20 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-on-surface">Memberships</h3>
          <p className="text-sm text-outline mt-1">Plan assignments and history</p>
        </div>
        <button
          type="button"
          onClick={onAddMembership}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-all"
        >
          <Icon name="add" size={18} />
          Add Membership
        </button>
      </div>
      {loading && memberships.length === 0 ? (
        <Skeleton className="h-24 rounded-2xl" />
      ) : memberships.length === 0 ? (
        <div className="text-center py-10 bg-surface-container-low/30 border border-dashed border-outline-variant/30 rounded-2xl">
          <p className="text-sm text-outline mb-4">No memberships yet.</p>
          <button
            type="button"
            onClick={onAddMembership}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow-sm hover:opacity-90 transition-all"
          >
            <Icon name="add" size={18} />
            Add Membership
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {memberships.map((m) => (
            <div key={m.id} className="p-4 rounded-2xl border border-outline-variant/20 hover:border-outline-variant/40 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon name="workspace_premium" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-on-surface text-base">
                    {m.plan?.name ?? "Plan"}
                  </p>
                  <p className="text-sm text-outline mt-0.5">
                    {formatDate(m.start_date)} → {formatDate(m.end_date)}
                    {m.freezes && m.freezes.length > 0 && (
                      <span className="ml-2 inline-flex items-center gap-1 text-tertiary">
                        <Icon name="ac_unit" size={14} />
                        {m.freezes.length} freeze
                        {m.freezes.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 text-xs font-semibold tracking-wide rounded-full border uppercase w-fit ${statusPill[m.status]}`}
              >
                {m.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AttendanceCard({
  attendance,
  loading,
}: {
  attendance: Array<{
    id: string;
    checkinAt: string;
    checkoutAt?: string | null;
    method: string;
    durationMinutes?: number | null;
  }>;
  loading: boolean;
}) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 hover:border-outline-variant/20 transition-all">
      <h3 className="text-lg font-bold text-on-surface mb-6">Recent Check-ins</h3>
      {loading ? (
        <Skeleton className="h-24 rounded-2xl" />
      ) : attendance.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-outline">No recent check-ins.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {attendance.map((a) => (
            <div key={a.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
                  <Icon
                    name={a.method === "QR" ? "qr_code_2" : "person"}
                    size={20}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {formatDateTime(a.checkinAt)}
                  </p>
                  <p className="text-xs text-outline mt-0.5 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${a.checkoutAt ? "bg-outline/50" : "bg-green-500 animate-pulse"}`} />
                    {a.checkoutAt
                      ? `Checked out · ${a.durationMinutes ?? 0} min`
                      : "Active"}
                    {" · "}
                    {a.method}
                  </p>
                </div>
              </div>
              <span className="text-xs text-outline font-medium bg-surface-container-low px-2.5 py-1 rounded-lg w-fit">
                {formatRelative(a.checkinAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QrDialog({
  isOpen,
  onClose,
  memberId,
  memberName,
}: {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
}) {
  const dispatch = useAppDispatch();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setToken(null);
    dispatch(generateQrToken(memberId))
      .unwrap()
      .then((res) => setToken(res.token))
      .catch((err: string) => toast.error(err))
      .finally(() => setLoading(false));
  }, [isOpen, memberId, dispatch]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title="Check-In QR"
        description={`Short-lived code for ${memberName}`}
      />
      <Modal.Body>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="w-52 h-52 rounded-2xl bg-surface-container-low flex items-center justify-center">
            {loading ? (
              <Skeleton className="w-44 h-44" />
            ) : token ? (
              <div className="text-center px-4">
                <Icon name="qr_code_2" size={120} className="text-primary" />
                <p className="mt-3 text-[10px] font-mono break-all text-outline">
                  {token.slice(0, 32)}…
                </p>
              </div>
            ) : (
              <Icon name="error" size={48} className="text-error" />
            )}
          </div>
          <p className="text-xs text-outline text-center max-w-xs">
            The code expires in about 60 seconds. Scan it from the check-in
            station to record entry.
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
}
