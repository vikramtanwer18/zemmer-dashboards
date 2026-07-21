"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { ErrorState, PageLoader, Skeleton } from "@/components/ui/states";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAttendanceAnalytics,
  fetchClassAnalytics,
  fetchLeadAnalytics,
  fetchMemberAnalytics,
  fetchRevenueAnalytics,
} from "@/store/slices/analytics.slice";
import { formatPaise } from "@/lib/utils/format";
import { asArray, normalizeBreakdown } from "@/lib/utils/normalize";
import {
  LeadStage,
  MemberStatus,
} from "@/lib/api/domain-types";
import { cn } from "@/lib/utils/cn";

type Range = "6" | "12" | "24";

export default function FinancialAnalyticsPage() {
  const dispatch = useAppDispatch();
  const [range, setRange] = useState<Range>("12");

  const revenue = useAppSelector((s) => s.analytics.revenue);
  const revenueLoading = useAppSelector((s) => s.analytics.revenueLoading);
  const revenueError = useAppSelector((s) => s.analytics.revenueError);
  const members = useAppSelector((s) => s.analytics.members);
  const attendance = useAppSelector((s) => s.analytics.attendance);
  const leads = useAppSelector((s) => s.analytics.leads);
  const classes = useAppSelector((s) => s.analytics.classes);

  useEffect(() => {
    const months = Number(range);
    dispatch(fetchRevenueAnalytics({ months }));
    dispatch(fetchMemberAnalytics({ months: Math.min(months, 24) }));
    dispatch(fetchAttendanceAnalytics({ days: 30, inactiveDays: 14 }));
    dispatch(fetchLeadAnalytics({ months: Math.min(months, 12) }));
    dispatch(fetchClassAnalytics({ days: 30 }));
  }, [dispatch, range]);

  return (
    <div className="p-8 pb-20 max-w-[1600px] mx-auto min-h-screen animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="relative mb-12 p-10 rounded-3xl overflow-hidden bg-surface-container-lowest border border-outline-variant/10 shadow-atmospheric">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                <Icon name="analytics" size={24} fill />
              </div>
              <h1 className="text-4xl font-black tracking-tight text-on-surface">
                Operations <span className="text-primary">Intelligence</span>
              </h1>
            </div>
            <p className="text-sm text-outline font-medium max-w-2xl">
              Real-time performance metrics across revenue streams, member retention, and lead conversion pipeline.
            </p>
          </div>
          
          <div className="flex bg-surface-container-low/50 backdrop-blur-md p-1.5 rounded-xl border border-outline-variant/10 shadow-inner self-start">
            {(["6", "12", "24"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "px-8 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all duration-300",
                  range === r
                    ? "bg-surface-container-lowest shadow-lg text-primary scale-105"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                )}
              >
                {r} Months
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KpiTile
          label="Paid Revenue"
          value={formatPaise(revenue?.outstanding.totalPaise)}
          icon="trending_up"
          loading={revenueLoading}
          trend="+12.5%"
        />
        <KpiTile
          label="Pending Dues"
          value={formatPaise(revenue?.outstanding.totalPaise)}
          icon="hourglass_empty"
          loading={revenueLoading}
        />
        <KpiTile
          label="Overdue Risk"
          value={formatPaise(revenue?.outstanding.overduePaise)}
          icon="warning"
          variant="urgent"
          loading={revenueLoading}
        />
        <KpiTile
          label="Lead Conversion"
          value={`${leads?.conversionRate ?? 0}%`}
          icon="auto_graph"
          trend="+4.2%"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-10 shadow-atmospheric relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-on-surface tracking-tight">Revenue Dynamics</h3>
                <p className="text-xs text-outline font-bold uppercase tracking-widest mt-1">
                  Cashflow Performance Timeline
                </p>
              </div>
              <div className="flex items-center gap-6 bg-surface-container-low/30 px-5 py-2.5 rounded-xl border border-outline-variant/5">
                <LegendItem label="Paid" color="bg-primary" />
                <LegendItem label="Outstanding" color="bg-amber-500/50" />
                <LegendItem label="Overdue" color="bg-error/60" />
              </div>
            </div>
            {revenueError ? (
              <ErrorState title="Couldn't load revenue" description={revenueError} />
            ) : revenueLoading ? (
              <Skeleton className="h-[300px] w-full rounded-xl" />
            ) : (
              <RevenueBars
                monthlyTrend={revenue?.monthlyTrend || []}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-10 shadow-atmospheric">
          <h3 className="text-2xl font-black text-on-surface tracking-tight mb-1">Member Health</h3>
          <p className="text-xs text-outline font-bold uppercase tracking-widest mb-10 text-primary">Status Distribution</p>
          {!members ? (
            <Skeleton className="h-[400px] w-full rounded-xl" />
          ) : (
            (() => {
              const breakdown = normalizeBreakdown<MemberStatus, "status">(
                members.statusBreakdown,
                "status",
              );
              const total = breakdown.reduce((s, r) => s + r.count, 0);
              return (
                <div className="space-y-8">
                  {breakdown.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-outline italic text-sm">
                      <Icon name="person_off" size={48} className="opacity-20 mb-4" />
                      No data available
                    </div>
                  ) : (
                    breakdown.map((row) => (
                      <StatusRow
                        key={row.status}
                        label={row.status}
                        count={row.count}
                        total={total}
                      />
                    ))
                  )}
                  <div className="pt-8 mt-4 border-t border-outline-variant/10 group">
                    <div className="flex items-center justify-between p-5 bg-error/5 rounded-2xl border border-error/10 group-hover:bg-error/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center">
                          <Icon name="heart_broken" size={20} />
                        </div>
                        <span className="text-xs font-black text-error uppercase tracking-wider">Churned This Month</span>
                      </div>
                      <span className="text-3xl font-black text-error tabular-nums">
                        {members.churnedThisMonth ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-10 shadow-atmospheric">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-on-surface tracking-tight">Lead Funnel</h3>
              <p className="text-xs text-outline font-bold uppercase tracking-widest mt-1">Pipeline Velocity</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Icon name="filter_alt" size={24} />
            </div>
          </div>
          {!leads ? (
            <Skeleton className="h-[300px] w-full rounded-xl" />
          ) : (
            (() => {
              const pipeline = normalizeBreakdown<LeadStage, "stage">(
                leads.pipeline,
                "stage",
              );
              const total = pipeline.reduce((s, r) => s + r.count, 0);
              return (
                <div className="space-y-6">
                  {pipeline.length === 0 ? (
                    <p className="text-sm text-outline italic text-center py-10">No leads active.</p>
                  ) : (
                    pipeline.map((p) => (
                      <StatusRow
                        key={p.stage}
                        label={p.stage}
                        count={p.count}
                        total={total}
                        variant="amber"
                      />
                    ))
                  )}
                </div>
              );
            })()
          )}
        </div>

        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-10 shadow-atmospheric">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-on-surface tracking-tight">Attendance Dynamics</h3>
              <p className="text-xs text-outline font-bold uppercase tracking-widest mt-1 text-primary">Peak Activity Analysis</p>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-outline uppercase tracking-widest">Active Today</span>
                <span className="text-2xl font-black text-primary">142</span>
              </div>
            </div>
          </div>
          {!attendance ? (
            <Skeleton className="h-[300px] w-full rounded-xl" />
          ) : (
            (() => {
              const top = asArray(attendance.topAttendees);
              const dist = asArray(attendance.hourDistribution);
              return (
                <div className="space-y-10">
                  <div className="grid grid-cols-3 gap-6">
                    <PremiumInlineStat
                      label="Rush Hour"
                      value={attendance.peakHour != null ? `${attendance.peakHour}:00` : "—"}
                      icon="schedule"
                      color="primary"
                    />
                    <PremiumInlineStat
                      label="Slipped Away"
                      value={String(attendance.inactiveMembers?.count ?? 0)}
                      icon="person_off"
                      color="error"
                    />
                    <PremiumInlineStat
                      label="Power User"
                      value={top[0]?.checkins ? `${top[0].checkins} pts` : "—"}
                      icon="workspace_premium"
                      color="amber"
                    />
                  </div>
                  <div className="pt-6">
                    <HourBars data={dist} />
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>

      {/* Class Performance */}
      {classes && (
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 p-12 shadow-atmospheric relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon name="star" size={20} fill />
                </div>
                <h3 className="text-3xl font-black text-on-surface tracking-tight">Class Excellence</h3>
              </div>
              <p className="text-sm text-outline font-bold uppercase tracking-widest">Engagement & Fill Rate Optimization</p>
            </div>
            <div className="flex gap-8 bg-surface-container-low/30 px-8 py-5 rounded-2xl border border-outline-variant/5">
               <div className="flex flex-col items-center">
                 <span className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Scheduled</span>
                 <span className="text-3xl font-black text-primary">{classes.upcomingCount ?? 0}</span>
               </div>
               <div className="w-px h-12 bg-outline-variant/10" />
               <div className="flex flex-col items-center">
                 <span className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Global Fill</span>
                 <span className="text-3xl font-black text-on-surface">{Math.round(classes.pastFillRate ?? 0)}%</span>
               </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {asArray<{
              id: string;
              name: string;
              bookingsCount: number;
              fillRate: number;
            }>(classes.topClasses).slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-6 p-6 bg-surface-container-low/20 rounded-xl border border-outline-variant/5 group hover:bg-primary/[0.03] hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-on-surface text-lg truncate mb-1">{c.name}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, c.fillRate)}%` }}
                      />
                    </div>
                    <span className="text-sm font-black text-primary tabular-nums whitespace-nowrap">
                      {Math.round(c.fillRate)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LegendItem({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn("w-3 h-3 rounded-full shadow-sm", color)} />
      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{label}</span>
    </div>
  );
}

function KpiTile({
  label,
  value,
  icon,
  variant = "default",
  loading,
  trend,
}: {
  label: string;
  value: string;
  icon: string;
  variant?: "default" | "urgent";
  loading?: boolean;
  trend?: string;
}) {
  const urgent = variant === "urgent";
  return (
    <div
      className={cn(
        "p-8 rounded-[2rem] shadow-sm space-y-6 border transition-all duration-500 hover:shadow-atmospheric hover:-translate-y-1 relative overflow-hidden group",
        urgent
          ? "bg-error/5 border-error/10 hover:border-error/20"
          : "bg-surface-container-lowest border-outline-variant/10 hover:border-outline-variant/20"
      )}
    >
      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110",
          urgent ? "bg-error/10 text-error shadow-[0_8px_20px_-4px_rgba(var(--error-rgb),0.2)]" : "bg-primary/10 text-primary shadow-[0_8px_20px_-4px_rgba(var(--primary-rgb),0.2)]"
        )}
      >
        <Icon name={icon} size={28} fill={!urgent} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className={cn("text-[10px] font-black uppercase tracking-widest", urgent ? "text-error/70" : "text-outline")}>
            {label}
          </p>
          {trend && (
            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {trend}
            </span>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-10 w-2/3 mt-2" />
        ) : (
          <h3 className={cn("text-3xl font-black tracking-tighter tabular-nums", urgent ? "text-error" : "text-on-surface")}>
            {value}
          </h3>
        )}
      </div>
    </div>
  );
}

function StatusRow({
  label,
  count,
  total,
  variant = "primary"
}: {
  label: string;
  count: number;
  total: number;
  variant?: "primary" | "amber";
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const isAmber = variant === "amber";
  return (
    <div className="space-y-3 group/row">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant group-hover/row:text-primary transition-colors">
          {label}
        </span>
        <div className="flex items-center gap-2">
           <span className="text-base font-black text-on-surface tabular-nums">{count}</span>
           <span className="text-[10px] font-black text-outline bg-surface-container-low px-2 py-0.5 rounded-md uppercase tracking-wider">
             {pct}%
           </span>
        </div>
      </div>
      <div className="h-3 bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/5 p-0.5">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out shadow-sm",
            isAmber ? "bg-amber-500" : "bg-primary"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function PremiumInlineStat({ label, value, icon, color }: { label: string; value: string; icon: string; color: "primary" | "error" | "amber" }) {
  const colors = {
    primary: "bg-primary/5 text-primary border-primary/10",
    error: "bg-error/5 text-error border-error/10",
    amber: "bg-amber-500/5 text-amber-600 border-amber-500/10"
  };
  
  return (
    <div className={cn("rounded-3xl p-6 border transition-all hover:scale-105 duration-300", colors[color])}>
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", colors[color].replace('bg-', 'bg-opacity-20 bg-'))}>
          <Icon name={icon} size={18} fill />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest leading-none opacity-80">
          {label}
        </p>
      </div>
      <p className="text-2xl font-black tracking-tight tabular-nums">{value}</p>
    </div>
  );
}

function HourBars({
  data,
}: {
  data: Array<{ hour: number; checkins: number }>;
}) {
  const max = Math.max(...data.map((d) => d.checkins), 1);
  return (
    <div className="flex items-end gap-2.5 h-40 px-2 group/chart">
      {data.map((d) => (
        <div
          key={d.hour}
          className="flex-1 bg-primary/10 hover:bg-primary transition-all duration-300 rounded-t-xl relative group/bar cursor-help"
          style={{ height: `${Math.max((d.checkins / max) * 100, 8)}%` }}
        >
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-on-surface text-surface text-[10px] font-black rounded-xl opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-all duration-300 translate-y-2 group-hover/bar:translate-y-0 shadow-xl whitespace-nowrap z-20">
            {d.hour}:00 · {d.checkins} Visits
          </div>
        </div>
      ))}
    </div>
  );
}

function RevenueBars({
  monthlyTrend,
}: {
  monthlyTrend: Array<{ month: string; revenuePaise: number }>;
}) {
  const max = Math.max(...monthlyTrend.map((m) => m.revenuePaise), 1);
  
  if (monthlyTrend.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-sm text-outline italic gap-4">
        <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center">
          <Icon name="payments" size={32} className="opacity-20" />
        </div>
        No revenue data for this range.
      </div>
    );
  }

  return (
    <div className="grid gap-6 items-end h-[320px] px-2" style={{ gridTemplateColumns: `repeat(${monthlyTrend.length}, minmax(0, 1fr))` }}>
      {monthlyTrend.map((m) => {
        const value = m.revenuePaise;
        const pct = Math.max((value / max) * 100, 4);
        return (
          <div key={m.month} className="flex flex-col items-center gap-4 group/rev h-full justify-end">
            <div className="relative w-full max-w-[48px] h-full flex flex-col justify-end">
               <div
                  className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-2xl rounded-b-lg shadow-sm group-hover/rev:shadow-lg group-hover/rev:scale-x-105 transition-all duration-500 cursor-pointer relative"
                  style={{ height: `${pct}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-on-surface text-surface text-[11px] font-black rounded-xl opacity-0 group-hover/rev:opacity-100 pointer-events-none transition-all duration-300 translate-y-2 group-hover/rev:translate-y-0 shadow-2xl whitespace-nowrap z-30">
                    {formatPaise(value)}
                  </div>
                </div>
            </div>
            <span className="text-[10px] font-black text-outline uppercase tracking-widest group-hover/rev:text-primary transition-colors">
              {m.month.split('-')[1]}/{m.month.split('-')[0].slice(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
