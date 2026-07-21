"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FormInput, FormSelect } from "@/components/ui/form-input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPlans } from "@/store/slices/plans.slice";
import { createMembership } from "@/store/slices/memberships.slice";

const schema = z.object({
  plan_id: z.string().min(1, "Pick a plan"),
  start_date: z.string().min(1, "Start date is required"),
});

type FormInput = z.infer<typeof schema>;

interface AddMembershipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
  onCreated?: () => void;
}

export const AddMembershipDialog: React.FC<AddMembershipDialogProps> = ({
  isOpen,
  onClose,
  memberId,
  memberName,
  onCreated,
}) => {
  const dispatch = useAppDispatch();
  const plans = useAppSelector((s) => s.plans.list);

  useEffect(() => {
    if (isOpen && plans.length === 0) {
      dispatch(fetchPlans({ limit: 100 }));
    }
  }, [isOpen, plans.length, dispatch]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      plan_id: "",
      start_date: new Date().toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        plan_id: "",
        start_date: new Date().toISOString().slice(0, 10),
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (values: FormInput) => {
    const action = await dispatch(
      createMembership({
        member_id: memberId,
        plan_id: values.plan_id,
        start_date: new Date(values.start_date).toISOString(),
        status: "ACTIVE",
      }),
    );
    if (createMembership.fulfilled.match(action)) {
      toast.success(
        `Enrolled ${memberName} in ${plans.find((p) => p.id === values.plan_id)?.name ?? "plan"}.`,
      );
      reset();
      onClose();
      onCreated?.();
    } else {
      toast.error(
        (action.payload as string) ?? "Unable to create membership.",
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title="Add Membership"
        description={`Assign a plan to ${memberName}.`}
      />
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Controller
            control={control}
            name="plan_id"
            render={({ field }) => (
              <CustomPlanSelect
                value={field.value}
                onChange={field.onChange}
                error={errors.plan_id?.message}
                plans={plans}
              />
            )}
          />
          <FormInput
            label="Start Date"
            type="date"
            icon="event"
            error={errors.start_date?.message}
            {...register("start_date")}
          />

          <div className="bg-primary/5 p-4 rounded-xl flex items-start gap-3 border border-primary/10">
            <Icon
              name="info"
              size={18}
              fill
              className="text-primary flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
              The end date is auto-computed from the plan&apos;s duration. Overlapping
              active or frozen memberships will be rejected.
            </p>
          </div>

          <Modal.Footer>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 gap-2"
              loading={isSubmitting}
            >
              <Icon name="add" size={18} />
              {isSubmitting ? "Adding…" : "Add Membership"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

function CustomPlanSelect({
  value,
  onChange,
  error,
  plans,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  plans: Array<{ id: string; name: string; duration_days: number }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedPlan = plans.find((p) => p.id === value);

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
        Plan
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl flex items-center justify-between px-4 cursor-pointer transition-all hover:border-outline-variant/40 ${error ? "border-error ring-2 ring-error/20" : ""} ${isOpen ? "ring-2 ring-primary/20 border-primary" : ""}`}
      >
        <div className="flex items-center gap-3">
          <Icon name="workspace_premium" size={20} className="text-outline" />
          {selectedPlan ? (
            <span className="text-sm font-semibold text-on-surface">
              {selectedPlan.name} <span className="text-outline font-medium">· {selectedPlan.duration_days}d</span>
            </span>
          ) : (
            <span className="text-sm text-outline/60">Select a plan...</span>
          )}
        </div>
        <Icon name="expand_more" size={20} className={`text-outline transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-xl max-h-60 overflow-y-auto p-2 flex flex-col gap-1">
          {plans.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                onChange(p.id);
                setIsOpen(false);
              }}
              className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${value === p.id ? "bg-primary/10 text-primary" : "hover:bg-surface-container-low text-on-surface"}`}
            >
              <div className="flex flex-col">
                <span className={`text-sm font-semibold ${value === p.id ? "text-primary" : "text-on-surface"}`}>{p.name}</span>
                <span className={`text-xs mt-0.5 ${value === p.id ? "text-primary/70" : "text-outline"}`}>{p.duration_days} days</span>
              </div>
              {value === p.id && <Icon name="check" size={18} />}
            </div>
          ))}
          {plans.length === 0 && (
            <div className="p-4 text-center text-sm text-outline">No plans available</div>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs font-medium text-error ml-1 flex items-center gap-1">
          <Icon name="error" size={14} />
          {error}
        </p>
      )}
    </div>
  );
}
