"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import { planSchema, type PlanInput } from "@/lib/validators/plans";
import { useAppDispatch } from "@/store/hooks";
import { createPlan, updatePlan } from "@/store/slices/plans.slice";
import type { Plan } from "@/lib/api/domain-types";

interface PlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: Plan | null;
}

type PlanFormInput = z.input<typeof planSchema>;

export const PlanDialog: React.FC<PlanDialogProps> = ({ isOpen, onClose, plan }) => {
  const dispatch = useAppDispatch();
  const isEdit = !!plan;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PlanFormInput, unknown, PlanInput>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      price: 0,
      duration_days: 30,
      description: "",
      max_freeze_days: 7,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: plan?.name ?? "",
        price: plan?.price ?? 0,
        duration_days: plan?.duration_days ?? 30,
        description: plan?.description ?? "",
        max_freeze_days: plan?.max_freeze_days ?? 7,
      });
    }
  }, [isOpen, plan, reset]);

  const onSubmit = async (values: PlanInput) => {
    const action = isEdit
      ? await dispatch(updatePlan({ id: plan!.id, patch: values }))
      : await dispatch(createPlan(values));

    if (
      (isEdit && updatePlan.fulfilled.match(action)) ||
      (!isEdit && createPlan.fulfilled.match(action))
    ) {
      toast.success(isEdit ? "Plan updated" : "Plan created");
      reset();
      onClose();
    } else {
      toast.error(
        (action.payload as string) ??
          (isEdit ? "Unable to update plan." : "Unable to create plan."),
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title={isEdit ? "Edit Plan" : "Create Plan"}
        description={
          isEdit
            ? "Adjust plan terms and freeze limits."
            : "Offer a new membership tier."
        }
      />
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormInput
            label="Plan Name"
            placeholder="Quarterly Elite"
            error={errors.name?.message}
            {...register("name")}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Price (₹)"
              type="number"
              min={0}
              step="0.01"
              placeholder="5000"
              error={errors.price?.message}
              {...register("price")}
            />
            <FormInput
              label="Duration (days)"
              type="number"
              min={1}
              placeholder="90"
              error={errors.duration_days?.message}
              {...register("duration_days")}
            />
          </div>
          <FormInput
            label="Max Freeze Days"
            type="number"
            min={0}
            placeholder="7"
            icon="ac_unit"
            hint="Total freeze days a member can use across all freezes"
            error={errors.max_freeze_days?.message}
            {...register("max_freeze_days")}
          />
          <FormTextarea
            label="Description"
            placeholder="Optional plan description"
            error={errors.description?.message}
            {...register("description")}
          />

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
              <Icon name={isEdit ? "save" : "add_circle"} size={18} />
              {isSubmitting ? "Saving…" : isEdit ? "Save Plan" : "Create Plan"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};
