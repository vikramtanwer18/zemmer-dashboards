"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  ErrorState,
  PageLoader,
  Skeleton,
} from "@/components/ui/states";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { PlanDialog } from "@/features/plans/components/plan-dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deletePlan,
  fetchPlanById,
} from "@/store/slices/plans.slice";
import { fetchMemberships } from "@/store/slices/memberships.slice";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export default function PlanDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const plan = useAppSelector((s) => s.plans.current);
  const loading = useAppSelector((s) => s.plans.detailLoading);
  const error = useAppSelector((s) => s.plans.detailError);
  const memberships = useAppSelector((s) => s.memberships.list);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchPlanById(id));
    dispatch(fetchMemberships({ limit: 50 }));
  }, [dispatch, id]);

  if (!id) return null;
  if (loading && !plan) return <PageLoader label="Loading plan…" />;
  if (error && !plan) {
    return (
      <ErrorState
        title="Couldn't load plan"
        description={error}
        onRetry={() => dispatch(fetchPlanById(id))}
      />
    );
  }
  if (!plan) return null;

  const planMemberships = memberships.filter((m) => m.plan_id === plan.id);
  const activeCount = planMemberships.filter((m) => m.status === "ACTIVE").length;
  const frozenCount = planMemberships.filter((m) => m.status === "FROZEN").length;
  const expiredCount = planMemberships.filter((m) => m.status === "EXPIRED").length;

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const action = await dispatch(deletePlan(plan.id));
      if (deletePlan.fulfilled.match(action)) {
        toast.success("Plan deleted");
        router.replace("/plans");
      } else {
        toast.error((action.payload as string) ?? "Unable to delete plan");
      }
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="p-8 pb-12 max-w-[1400px] mx-auto min-h-screen">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <nav className="flex items-center text-xs text-outline mb-2 font-medium">
            <Link href="/plans" className="hover:text-primary transition-colors">
              Plans
            </Link>
            <Icon name="chevron_right" size={14} className="mx-1 opacity-50" />
            <span className="text-on-surface font-bold">{plan.name}</span>
          </nav>
          <h1 className="text-2xl font-black text-on-surface tracking-tighter">
            {plan.name}
          </h1>
          {plan.description && (
            <p className="text-sm text-outline font-medium max-w-xl mt-1">
              {plan.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10 w-auto px-4 text-xs font-bold"
            onClick={() => setEditOpen(true)}
          >
            <Icon name="edit" size={16} />
            Edit
          </Button>
          <Button
            variant="danger"
            className="h-10 w-auto px-4 text-xs font-bold"
            onClick={handleDelete}
          >
            <Icon name="delete" size={16} />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatTile label="Price" value={formatCurrency(plan.price)} />
            <StatTile label="Duration" value={`${plan.duration_days} days`} />
            <StatTile label="Max Freeze" value={`${plan.max_freeze_days} days`} />
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-atmospheric">
            <h3 className="text-lg font-bold text-on-surface mb-4">
              Members on this plan
            </h3>
            {loading && planMemberships.length === 0 ? (
              <Skeleton className="h-24" />
            ) : planMemberships.length === 0 ? (
              <p className="text-sm text-outline italic">
                No members are currently assigned to this plan.
              </p>
            ) : (
              <div className="divide-y divide-outline-variant/10">
                {planMemberships.slice(0, 20).map((m) => (
                  <div
                    key={m.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-on-surface">
                        {m.member?.name ?? m.member_id}
                      </p>
                      <p className="text-xs text-outline">
                        {formatDate(m.start_date)} → {formatDate(m.end_date)}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-surface-container-high text-on-surface-variant rounded-md border border-outline-variant/30">
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-atmospheric">
              <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-4">
                At a glance
              </h3>
              <dl className="space-y-3 text-sm">
                <Row label="Active" value={String(activeCount)} />
                <Row label="Frozen" value={String(frozenCount)} />
                <Row label="Expired" value={String(expiredCount)} />
                <Row label="Created" value={formatDate(plan.createdAt)} />
              </dl>
            </div>
          </div>
        </div>
      </div>

      <PlanDialog
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        plan={plan}
      />

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Plan"
        description={`Are you sure you want to delete "${plan.name}"? This action cannot be undone and may affect existing memberships.`}
        confirmLabel="Delete Plan"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-atmospheric">
      <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">
        {label}
      </p>
      <p className="text-2xl font-black text-on-surface tracking-tighter">
        {value}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-outline font-semibold">{label}</dt>
      <dd className="text-on-surface font-bold">{value}</dd>
    </div>
  );
}
