"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  ErrorState,
  PageLoader,
  Skeleton,
} from "@/components/ui/states";
import { ClassDialog } from "@/features/classes/components/class-dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteClass,
  fetchClassById,
} from "@/store/slices/classes.slice";
import {
  cancelBooking,
  fetchBookings,
} from "@/store/slices/bookings.slice";
import type { BookingStatus } from "@/lib/api/domain-types";
import { formatDateTime, formatDuration, initialsFromName } from "@/lib/utils/format";

const statusColors: Record<BookingStatus, string> = {
  CONFIRMED: "bg-green-500/10 text-green-700 border-green-500/20",
  WAITLISTED: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  CANCELLED: "bg-outline-variant/30 text-outline border-outline-variant/30",
};

export default function SessionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const gymClass = useAppSelector((s) => s.classes.current);
  const loading = useAppSelector((s) => s.classes.detailLoading);
  const error = useAppSelector((s) => s.classes.detailError);
  const bookings = useAppSelector((s) => s.bookings.list);
  const bookingsLoading = useAppSelector((s) => s.bookings.listLoading);

  const [editOpen, setEditOpen] = useState(false);
  const [cancelSessionOpen, setCancelSessionOpen] = useState(false);
  const [cancelBookingOpen, setCancelBookingOpen] = useState<{ id: string, name: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchClassById(id));
    dispatch(fetchBookings({ class_id: id, limit: 100 }));
  }, [dispatch, id]);

  if (!id) return null;
  if (loading && !gymClass) return <PageLoader label="Loading session…" />;
  if (error && !gymClass) {
    return (
      <ErrorState
        title="Couldn't load session"
        description={error}
        onRetry={() => dispatch(fetchClassById(id))}
      />
    );
  }
  if (!gymClass) return null;

  const handleCancelClass = async () => {
    setIsProcessing(true);
    const action = await dispatch(deleteClass(gymClass.id));
    setIsProcessing(false);
    if (deleteClass.fulfilled.match(action)) {
      toast.success("Class cancelled successfully");
      setCancelSessionOpen(false);
      router.replace("/schedule");
    } else {
      toast.error((action.payload as string) ?? "Unable to cancel class");
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelBookingOpen) return;
    setIsProcessing(true);
    const action = await dispatch(cancelBooking(cancelBookingOpen.id));
    setIsProcessing(false);
    if (cancelBooking.fulfilled.match(action)) {
      toast.success(`Booking for ${cancelBookingOpen.name} cancelled`);
      setCancelBookingOpen(null);
    } else {
      toast.error((action.payload as string) ?? "Unable to cancel");
    }
  };

  const classBookings = bookings.filter((b) => b.class_id === gymClass.id);
  const confirmed = classBookings.filter((b) => b.status === "CONFIRMED");
  const waitlisted = classBookings.filter((b) => b.status === "WAITLISTED");

  return (
    <div className="p-8 pb-12 max-w-[1600px] mx-auto min-h-screen space-y-8">
      {/* Navigation & Breadcrumbs */}
      <nav className="flex items-center text-[10px] font-bold uppercase tracking-widest text-outline">
        <Link href="/operations/classes" className="hover:text-primary transition-colors">Operations</Link>
        <Icon name="chevron_right" size={14} className="mx-2 opacity-40" />
        <span className="text-on-surface">Session Details</span>
      </nav>

      {/* Header Block */}
      <section className="relative bg-surface-container-lowest p-6 sm:p-8 rounded-[32px] shadow-sm border border-outline-variant/10 overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl ring-8 ring-primary/5">
              {initialsFromName(gymClass.name).slice(0, 2)}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight text-on-surface">
                  {gymClass.name}
                </h1>
                <span className="px-3 py-1 text-[10px] font-bold tracking-wider rounded-full border uppercase bg-green-500/10 text-green-700 border-green-500/20">
                  Confirmed
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Pill icon="calendar_today" label={formatDateTime(gymClass.starts_at)} />
                <Pill
                  icon="schedule"
                  label={`${formatDuration((new Date(gymClass.ends_at).getTime() - new Date(gymClass.starts_at).getTime()) / 60000)} Duration`}
                  muted
                />
                {gymClass.trainer && (
                  <Pill icon="person" label={gymClass.trainer.name} muted />
                )}
                <Pill icon="groups" label={`${confirmed.length}/${gymClass.capacity} Booked`} muted />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              className="h-10 px-4 text-xs rounded-xl font-bold border-outline-variant/20 hover:bg-surface-container-low transition-all"
              onClick={() => setEditOpen(true)}
            >
              <Icon name="edit" size={16} className="mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="h-10 px-4 text-xs rounded-xl font-bold border-error/20 text-error hover:bg-error/5 transition-all"
              onClick={() => setCancelSessionOpen(true)}
            >
              <Icon name="cancel" size={16} className="mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </section>

      {/* Stats & Quick Info Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatTile label="Capacity" value={String(gymClass.capacity)} icon="groups" />
          <StatTile 
            label="Confirmed" 
            value={String(confirmed.length)} 
            icon="check_circle" 
            hint={`${Math.round((confirmed.length / gymClass.capacity) * 100)}% Occupancy`}
          />
          <StatTile label="Waitlisted" value={String(waitlisted.length)} icon="hourglass_empty" />
        </div>
        
        <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-6 shadow-sm group hover:border-primary/20 transition-all flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Session Insight</p>
            <Icon name="info" size={18} className="text-outline/40 group-hover:text-primary/60 transition-colors" />
          </div>
          <p className="text-sm text-on-surface-variant font-semibold leading-relaxed line-clamp-3">
            {gymClass.description || "High-intensity performance training session focusing on core strength and functional movements."}
          </p>
        </div>
      </div>

      {/* Attendees Table Style Section */}
      <section className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
              <Icon name="person" size={20} />
            </div>
            <h3 className="text-lg font-bold text-on-surface tracking-tight">Active Bookings</h3>
          </div>
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest">
            {classBookings.length} Total
          </p>
        </div>
        
        {bookingsLoading && classBookings.length === 0 ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        ) : classBookings.length === 0 ? (
          <EmptyState
            icon="person_off"
            title="No bookings yet"
            description="Members can still book this class if it's upcoming."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-surface-container-low/20">
            {classBookings.map((b) => (
              <div
                key={b.id}
                className="bg-surface-container-lowest border border-outline-variant/10 p-5 rounded-2xl flex items-center justify-between group/row hover:border-primary/20 transition-all hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center font-bold text-sm border border-outline-variant/5 group-hover/row:bg-primary/5 group-hover/row:text-primary transition-colors">
                    {initialsFromName(b.member?.name)}
                  </div>
                  <div>
                    {b.member ? (
                      <Link
                        href={`/members/${b.member.id}`}
                        className="font-bold text-on-surface hover:text-primary transition-colors text-base"
                      >
                        {b.member.name}
                      </Link>
                    ) : (
                      <span className="font-bold text-on-surface text-base">Unknown</span>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        b.status === 'CONFIRMED' ? 'text-green-600' : 'text-outline'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {b.status !== "CANCELLED" && (
                  <button
                    onClick={() => setCancelBookingOpen({ id: b.id, name: b.member?.name || "Unknown" })}
                    className="w-8 h-8 rounded-lg bg-surface-container-low text-outline hover:bg-error/5 hover:text-error flex items-center justify-center transition-all opacity-0 group-hover/row:opacity-100"
                    title="Cancel Booking"
                  >
                    <Icon name="close" size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <ClassDialog
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        gymClass={gymClass}
      />

      <ConfirmationDialog
        isOpen={cancelSessionOpen}
        onClose={() => setCancelSessionOpen(false)}
        onConfirm={handleCancelClass}
        variant="danger"
        title="Cancel Session?"
        description={`Are you sure you want to cancel "${gymClass.name}"? This will remove all current bookings and notify the attendees.`}
        confirmLabel="Yes, Cancel Session"
        isLoading={isProcessing}
      />

      <ConfirmationDialog
        isOpen={!!cancelBookingOpen}
        onClose={() => setCancelBookingOpen(null)}
        onConfirm={handleCancelBooking}
        variant="warning"
        title="Cancel Booking?"
        description={`Remove ${cancelBookingOpen?.name} from this session? They will be notified of the cancellation.`}
        confirmLabel="Cancel Booking"
        isLoading={isProcessing}
      />
    </div>
  );
}

function StatTile({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon: string;
  hint?: string;
}) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm group hover:border-primary/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
          {label}
        </p>
        <Icon name={icon} size={18} className="text-outline/40 group-hover:text-primary/60 transition-colors" />
      </div>
      <p className="text-3xl font-bold text-on-surface tracking-tight">
        {value}
      </p>
      {hint && (
        <div className="mt-3 space-y-1.5">
          <div className="h-1 w-full bg-surface-container-low rounded-full overflow-hidden">
            <div className="h-full bg-primary/40 rounded-full" style={{ width: hint.split('%')[0] + '%' }} />
          </div>
          <p className="text-[9px] font-bold text-primary uppercase tracking-widest">{hint}</p>
        </div>
      )}
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
      <span className="text-xs font-medium whitespace-nowrap">{label}</span>
    </div>
  );
}
