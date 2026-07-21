"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { FormInput } from "@/components/ui/form-input";
import { Modal } from "@/components/ui/modal";
import { AddMemberDialog } from "@/features/members/components/add-member-dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAttendanceAnalytics,
  fetchOverview,
  fetchRevenueAnalytics,
} from "@/store/slices/analytics.slice";
import { checkInManual } from "@/store/slices/attendance.slice";
import { fetchMembers } from "@/store/slices/members.slice";
import { formatCurrency, formatRelative } from "@/lib/utils/format";
import { asArray } from "@/lib/utils/normalize";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const overview = useAppSelector((s) => s.analytics.overview);
  const overviewLoading = useAppSelector((s) => s.analytics.overviewLoading);
  const overviewError = useAppSelector((s) => s.analytics.overviewError);
  const revenue = useAppSelector((s) => s.analytics.revenue);
  const attendance = useAppSelector((s) => s.analytics.attendance);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOverview());
    dispatch(fetchRevenueAnalytics({ months: 6 }));
    dispatch(fetchAttendanceAnalytics({ days: 30, inactiveDays: 14 }));
  }, [dispatch]);

  const reload = () => {
    dispatch(fetchOverview());
    dispatch(fetchRevenueAnalytics({ months: 6 }));
    dispatch(fetchAttendanceAnalytics({ days: 30, inactiveDays: 14 }));
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-on-surface">
            Dashboard Overview
          </h2>
          <p className="text-sm text-outline font-medium">
            Welcome back, here is what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="w-auto whitespace-nowrap px-5 h-11 text-xs"
            onClick={() => setCheckInOpen(true)}
          >
            <Icon name="qr_code_scanner" size={18} className="text-primary" />
            Check In Member
          </Button>
          <Button
            variant="primary"
            className="w-auto px-6 h-11 text-xs"
            onClick={() => setIsAddMemberOpen(true)}
          >
            <Icon name="person_add" size={18} />
            Add Member
          </Button>
        </div>
      </div>

      {overviewError ? (
        <ErrorState
          title="Couldn't load your dashboard"
          description={overviewError}
          onRetry={reload}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewLoading && !overview ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-36" />
              ))
            ) : (
              <>
                <KpiCard
                  label="Active Members"
                  value={String(overview?.members?.active ?? 0)}
                  icon="group"
                  subtitle={`of ${overview?.members?.total ?? 0} total`}
                />
                <KpiCard
                  label="Revenue (This Month)"
                  value={formatCurrency(
                    revenue?.totals?.paid
                      ? revenue.totals.paid / 100
                      : (overview?.revenue?.paidThisMonth ?? 0) / 100,
                  )}
                  icon="trending_up"
                />
                <KpiCard
                  label="Outstanding"
                  value={formatCurrency(
                    (overview?.revenue?.outstanding ?? 0) / 100,
                  )}
                  icon="account_balance_wallet"
                  variant={
                    (overview?.revenue?.overdue ?? 0) > 0 ? "urgent" : "default"
                  }
                />
                <KpiCard
                  label="Check-ins Today"
                  value={String(overview?.attendance?.checkinsToday ?? 0)}
                  icon="door_front"
                  subtitle={
                    overview?.attendance?.peakHour != null
                      ? `Peak ${overview.attendance.peakHour}:00`
                      : undefined
                  }
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 shadow-atmospheric">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Revenue Trend</h3>
                  <p className="text-xs text-outline">Last 6 months</p>
                </div>
                <Link
                  href="/analytics"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Full analytics →
                </Link>
              </div>
              {revenue ? (
                <RevenueBars
                  months={asArray<{
                    month: string;
                    paid: number;
                    outstanding: number;
                  }>(revenue.months)}
                />
              ) : (
                <Skeleton className="h-48" />
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 shadow-atmospheric">
              <h3 className="text-lg font-bold text-on-surface mb-1">Lead Funnel</h3>
              <p className="text-xs text-outline mb-6">Open opportunities</p>
              <div className="space-y-4">
                <FunnelRow
                  label="Open Leads"
                  value={overview?.leads?.totalOpen ?? 0}
                  icon="contact_phone"
                />
                <FunnelRow
                  label="Conversion Rate"
                  value={`${overview?.leads?.conversionRate ?? 0}%`}
                  icon="insights"
                />
                <FunnelRow
                  label="Upcoming Classes"
                  value={overview?.classes?.upcoming ?? 0}
                  icon="fitness_center"
                />
                <FunnelRow
                  label="Avg Fill Rate"
                  value={`${overview?.classes?.avgFillRate ?? 0}%`}
                  icon="bar_chart"
                />
              </div>
              <Link
                href="/leads"
                className="block mt-6 text-center text-xs font-bold text-primary hover:underline"
              >
                View Leads →
              </Link>
            </div>
          </div>

          <TopAttendeesSection />
        </>
      )}

      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSuccess={reload}
      />
      <QuickCheckInDialog
        isOpen={checkInOpen}
        onClose={() => setCheckInOpen(false)}
      />
    </div>
  );
}

function FunnelRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Icon name={icon} size={18} />
        </div>
        <span className="text-sm font-semibold text-on-surface">{label}</span>
      </div>
      <span className="text-lg font-black text-on-surface tracking-tight">
        {value}
      </span>
    </div>
  );
}

function RevenueBars({
  months,
}: {
  months: Array<{ month: string; paid: number; outstanding: number }>;
}) {
  if (!months?.length) {
    return (
      <EmptyState
        icon="bar_chart"
        title="No revenue yet"
        description="Revenue trends will appear here once invoices are paid."
      />
    );
  }
  const max = Math.max(...months.map((m) => m.paid + m.outstanding), 1);
  return (
    <div className="grid grid-cols-6 gap-2 h-48 items-end">
      {months.map((m) => {
        const paidH = Math.max((m.paid / max) * 160, 4);
        const outH = Math.max((m.outstanding / max) * 160, 0);
        return (
          <div key={m.month} className="flex flex-col items-center gap-2">
            <div
              className="flex flex-col w-full rounded-lg overflow-hidden bg-surface-container-low"
              style={{ height: 176 }}
            >
              <div className="flex-1" />
              <div
                className="bg-outline-variant/50"
                style={{ height: outH }}
                title={`Outstanding: ${formatCurrency(m.outstanding / 100)}`}
              />
              <div
                className="bg-gradient-to-t from-primary to-primary-container"
                style={{ height: paidH }}
                title={`Paid: ${formatCurrency(m.paid / 100)}`}
              />
            </div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
              {m.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TopAttendeesSection() {
  const attendance = useAppSelector((s) => s.analytics.attendance);
  if (!attendance) return null;
  const top = asArray(attendance.topAttendees);
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 shadow-atmospheric">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-on-surface">Top Attendees</h3>
          <p className="text-xs text-outline">Last 30 days</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-outline">
          {attendance.inactiveMembers?.count ?? 0} inactive
        </span>
      </div>
      {top.length === 0 ? (
        <EmptyState
          icon="trending_flat"
          title="No check-ins yet"
          description="Attendance records will populate this table."
        />
      ) : (
        <div className="divide-y divide-outline-variant/10">
          {top.slice(0, 5).map((m, idx) => (
            <div key={m.member.id} className="flex items-center gap-4 py-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                {idx + 1}
              </div>
              <span className="flex-1 font-bold text-on-surface">
                {m.member.name}
              </span>
              <span className="text-sm text-outline font-bold">
                {m.checkins} visits
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuickCheckInDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const members = useAppSelector((s) => s.members.list);
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && members.length === 0) {
      dispatch(fetchMembers({ limit: 50 }));
    }
  }, [isOpen, members.length, dispatch]);

  const filtered = members.filter(
    (m) =>
      !query.trim() ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.phone.includes(query),
  );

  const handleCheckIn = async (memberId: string) => {
    setSubmitting(true);
    const action = await dispatch(checkInManual({ member_id: memberId }));
    setSubmitting(false);
    if (checkInManual.fulfilled.match(action)) {
      toast.success("Checked in");
      reload();
      onClose();
    } else {
      toast.error((action.payload as string) ?? "Check-in failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title="Quick Check-In"
        description="Search a member and mark them present."
      />
      <Modal.Body>
        <FormInput
          icon="search"
          placeholder="Search by name or phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="mt-4 max-h-80 overflow-y-auto divide-y divide-outline-variant/10">
          {filtered.length === 0 ? (
            <p className="text-sm text-outline text-center py-8">No members found.</p>
          ) : (
            filtered.slice(0, 30).map((m) => (
              <button
                key={m.id}
                onClick={() => handleCheckIn(m.id)}
                disabled={submitting}
                className="w-full flex items-center justify-between py-3 hover:bg-surface-container-low transition-colors text-left px-2 rounded-lg disabled:opacity-60"
              >
                <div>
                  <p className="font-bold text-on-surface">{m.name}</p>
                  <p className="text-xs text-outline">
                    {m.phone}
                    {m.lastVisitAt
                      ? ` · last visit ${formatRelative(m.lastVisitAt)}`
                      : ""}
                  </p>
                </div>
                <Icon name="login" className="text-primary" />
              </button>
            ))
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
