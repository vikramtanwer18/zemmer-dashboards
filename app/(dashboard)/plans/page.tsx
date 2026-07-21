"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  EmptyState,
  ErrorState,
  Skeleton,
} from "@/components/ui/states";
import { PlanDialog } from "@/features/plans/components/plan-dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deletePlan, fetchPlans } from "@/store/slices/plans.slice";
import { formatCurrency } from "@/lib/utils/format";
import type { Plan } from "@/lib/api/domain-types";

export default function PlansPage() {
  const dispatch = useAppDispatch();
  const { list, listLoading, listError } = useAppSelector((s) => s.plans);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);

  useEffect(() => {
    dispatch(fetchPlans({ limit: 100 }));
  }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (plan: Plan) => {
    setEditing(plan);
    setDialogOpen(true);
  };

  const handleDelete = async (plan: Plan) => {
    if (!confirm(`Delete plan "${plan.name}"? Members on this plan cannot be on it anymore.`))
      return;
    const action = await dispatch(deletePlan(plan.id));
    if (deletePlan.fulfilled.match(action)) {
      toast.success("Plan deleted");
    } else {
      toast.error((action.payload as string) ?? "Unable to delete plan");
    }
  };

  return (
    <div className="p-8 pb-12 max-w-[1600px] mx-auto min-h-screen space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tighter mb-1">
            Plans
          </h2>
          <p className="text-sm text-outline font-medium max-w-xl">
            Configure membership tiers, pricing, duration, and freeze rules.
          </p>
        </div>
        <Button
          variant="primary"
          className="h-11 max-w-[200px] px-6 text-xs shadow-lg shadow-primary/20"
          onClick={openCreate}
        >
          <Icon name="add_circle" size={18} />
          Create Plan
        </Button>
      </div>

      {listError ? (
        <ErrorState
          description={listError}
          onRetry={() => dispatch(fetchPlans({ limit: 100 }))}
        />
      ) : listLoading && list.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon="card_membership"
          title="No plans yet"
          description="Create your first membership plan to start assigning it to members."
          action={
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-lg shadow-primary/20"
            >
              <Icon name="add" size={16} />
              Create Plan
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={() => openEdit(plan)}
              onDelete={() => handleDelete(plan)}
            />
          ))}
        </div>
      )}

      <PlanDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        plan={editing}
      />
    </div>
  );
}

function PlanCard({
  plan,
  onEdit,
  onDelete,
}: {
  plan: Plan;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 flex flex-col h-full border border-outline-variant/10 shadow-sm transition-all hover:shadow-md group">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon name="workspace_premium" size={20} />
          </div>
          <div className="min-w-0">
            <Link
              href={`/plans/${plan.id}`}
              className="text-base font-bold text-on-surface leading-tight group-hover:text-primary transition-colors truncate block"
            >
              {plan.name}
            </Link>
            <p className="text-[11px] text-outline font-medium line-clamp-1 mt-0.5">
              {plan.description || "No description"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <button onClick={onDelete} className="w-8 h-8 rounded-lg bg-error/5 text-error hover:bg-error/10 flex items-center justify-center transition-colors">
            <Icon name="delete" size={16} />
          </button>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-1.5 mb-3 pb-3 border-b border-outline-variant/10 mt-1">
        <span className="text-3xl font-black text-on-surface tracking-tighter tabular-nums leading-none">
          {formatCurrency(plan.price)}
        </span>
        <span className="text-outline text-[10px] font-bold tracking-widest uppercase">
          / {plan.duration_days}d
        </span>
      </div>

      {/* Details List */}
      <div className="space-y-2 mb-5 mt-auto">
        <div className="flex items-center gap-2.5 text-xs text-on-surface-variant font-medium">
          <Icon name="check_circle" size={16} className="text-primary shrink-0" />
          <span>Valid for <span className="font-bold">{plan.duration_days}</span> days</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-on-surface-variant font-medium">
          <Icon name="check_circle" size={16} className="text-primary shrink-0" />
          <span><span className="font-bold">{plan.max_freeze_days}</span> freeze days allowed</span>
        </div>
        {plan.memberCount !== undefined && (
          <div className="flex items-center gap-2.5 text-xs text-on-surface-variant font-medium">
            <Icon name="group" size={16} className="text-primary shrink-0" />
            <span><span className="font-bold">{plan.memberCount}</span> active members</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-outline-variant/10 mt-auto">
        <Button variant="outline" onClick={onEdit} className="w-full h-9 text-xs font-bold tracking-wide transition-colors group-hover:border-primary/30 group-hover:text-primary">
          <Icon name="edit" size={14} className="mr-1.5" /> Edit Plan
        </Button>
      </div>
    </div>
  );
}
