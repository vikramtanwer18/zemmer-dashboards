"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import { freezeSchema, type FreezeInput } from "@/lib/validators/members";
import { useAppDispatch } from "@/store/hooks";
import { freezeMembership } from "@/store/slices/memberships.slice";

interface FreezeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  membershipId: string | null;
}

type FreezeFormInput = z.input<typeof freezeSchema>;

export const FreezeDialog: React.FC<FreezeDialogProps> = ({
  isOpen,
  onClose,
  memberName,
  membershipId,
}) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FreezeFormInput, unknown, FreezeInput>({
    resolver: zodResolver(freezeSchema),
    defaultValues: { duration_days: 7, reason: "" },
  });

  const onSubmit = async (values: FreezeInput) => {
    if (!membershipId) {
      toast.error("No active membership to freeze.");
      return;
    }
    const action = await dispatch(
      freezeMembership({
        id: membershipId,
        duration_days: values.duration_days,
        reason: values.reason || undefined,
      }),
    );
    if (freezeMembership.fulfilled.match(action)) {
      toast.success(`${memberName}'s membership frozen for ${values.duration_days} days.`);
      reset();
      onClose();
    } else {
      toast.error((action.payload as string) ?? "Unable to freeze membership.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title="Freeze Membership"
        description={`Pause ${memberName}'s membership. End date will extend by the same number of days.`}
      />
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormInput
            label="Duration (days)"
            type="number"
            icon="ac_unit"
            min={1}
            max={90}
            error={errors.duration_days?.message}
            {...register("duration_days")}
          />
          <FormTextarea
            label="Reason (optional)"
            placeholder="e.g. Travel, injury"
            error={errors.reason?.message}
            {...register("reason")}
          />

          <div className="bg-amber-500/5 p-4 rounded-xl flex items-start gap-3 border border-amber-500/10">
            <Icon name="info" size={18} fill className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
              Freezing suspends facility access immediately. The membership end date shifts forward by the same duration.
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
              <Icon name="ac_unit" size={18} />
              {isSubmitting ? "Freezing…" : "Freeze"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};
