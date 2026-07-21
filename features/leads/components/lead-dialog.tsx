"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/ui/form-input";
import { CustomSelect } from "@/components/ui/custom-select";
import { leadSchema, type LeadInput } from "@/lib/validators/leads";
import { useAppDispatch } from "@/store/hooks";
import { createLead, updateLead } from "@/store/slices/leads.slice";
import type { Lead } from "@/lib/api/domain-types";

interface LeadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
}

export const LeadDialog: React.FC<LeadDialogProps> = ({
  isOpen,
  onClose,
  lead,
}) => {
  const dispatch = useAppDispatch();
  const isEdit = !!lead;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
  } = useForm<LeadInput>({
    mode: "onChange",
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      source: "WALK_IN",
      stage: "NEW",
      notes: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: lead?.name ?? "",
        phone: lead?.phone ?? "",
        email: lead?.email ?? "",
        source: lead?.source ?? "WALK_IN",
        stage: lead?.stage ?? "NEW",
        notes: lead?.notes ?? "",
      });
    }
  }, [isOpen, lead, reset]);

  const onSubmit = async (values: LeadInput) => {
    const payload = {
      ...values,
      email: values.email || undefined,
      notes: values.notes || undefined,
    };
    const action = isEdit
      ? await dispatch(updateLead({ id: lead!.id, patch: payload }))
      : await dispatch(createLead(payload));
    if (
      (isEdit && updateLead.fulfilled.match(action)) ||
      (!isEdit && createLead.fulfilled.match(action))
    ) {
      toast.success(isEdit ? "Lead updated" : "Lead created");
      reset();
      onClose();
    } else {
      toast.error(
        (action.payload as string) ??
          (isEdit ? "Unable to update lead." : "Unable to create lead."),
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title={isEdit ? "Edit Lead" : "New Lead"}
        description="Capture a prospect and move them through your pipeline."
      />
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormInput
            label="Name *"
            placeholder="e.g. John Doe"
            icon="person"
            error={errors.name?.message}
            {...register("name")}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Phone *"
              placeholder="e.g. 9876543210"
              icon="call"
              type="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <FormInput
              label="Email *"
              placeholder="e.g. john@example.com"
              icon="mail"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="source"
              render={({ field: { onChange, value } }) => (
                <CustomSelect
                  label="Source *"
                  options={[
                    { label: "Walk-in", value: "WALK_IN" },
                    { label: "Website", value: "WEBSITE" },
                    { label: "Instagram", value: "INSTAGRAM" },
                    { label: "Referral", value: "REFERRAL" },
                  ]}
                  value={value}
                  onChange={onChange}
                  error={errors.source?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="stage"
              render={({ field: { onChange, value } }) => (
                <CustomSelect
                  label="Stage *"
                  options={[
                    { label: "New", value: "NEW" },
                    { label: "Contacted", value: "CONTACTED" },
                    { label: "Trial", value: "TRIAL" },
                    { label: "Negotiation", value: "NEGOTIATION" },
                    { label: "Won", value: "WON" },
                    { label: "Lost", value: "LOST" },
                  ]}
                  value={value}
                  onChange={onChange}
                  error={errors.stage?.message}
                />
              )}
            />
          </div>
          <FormTextarea
            label="Notes"
            placeholder="Context, interests, etc."
            error={errors.notes?.message}
            {...register("notes")}
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
              disabled={!isValid || isSubmitting || (isEdit && !isDirty)}
            >
              <Icon name={isEdit ? "save" : "add_circle"} size={18} />
              {isSubmitting ? "Saving…" : isEdit ? "Save" : "Create Lead"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};
