"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FormInput, FormSelect, FormTextarea } from "@/components/ui/form-input";
import { CustomSelect } from "@/components/ui/custom-select";
import { memberSchema } from "@/lib/validators/members";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createMember } from "@/store/slices/members.slice";
import { fetchPlans } from "@/store/slices/plans.slice";
import { createMembership } from "@/store/slices/memberships.slice";
import { applyServerFieldErrors } from "@/lib/api/error";

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const addMemberFormSchema = memberSchema.extend({
  plan_id: z.string().optional().or(z.literal("")),
  start_date: z.string().optional().or(z.literal("")),
});

type AddMemberFormInput = z.infer<typeof addMemberFormSchema>;

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const plans = useAppSelector((s) => s.plans.list);
  const [assignMembership, setAssignMembership] = useState(false);

  useEffect(() => {
    if (isOpen && plans.length === 0) {
      dispatch(fetchPlans({ limit: 100 }));
    }
  }, [isOpen, plans.length, dispatch]);

  useEffect(() => {
    if (!isOpen) setAssignMembership(false);
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<AddMemberFormInput>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      dob: "",
      gender: undefined,
      status: "ACTIVE",
      notes: "",
      plan_id: "",
      start_date: new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = async (values: AddMemberFormInput) => {
    if (assignMembership && !values.plan_id) {
      setError("plan_id", { type: "manual", message: "Pick a plan or turn off membership" });
      return;
    }

    const memberAction = await dispatch(
      createMember({
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        dob: values.dob || undefined,
        gender: values.gender,
        status: values.status,
        notes: values.notes || undefined,
      }),
    );

    if (!createMember.fulfilled.match(memberAction)) {
      const msg = (memberAction.payload as string) ?? "Unable to create member.";
      applyServerFieldErrors<AddMemberFormInput>(memberAction.error, setError);
      toast.error(msg);
      return;
    }

    const newMember = memberAction.payload.member;

    if (assignMembership && values.plan_id && values.start_date) {
      const ms = await dispatch(
        createMembership({
          member_id: newMember.id,
          plan_id: values.plan_id,
          start_date: new Date(values.start_date).toISOString(),
          status: "ACTIVE",
        }),
      );
      if (createMembership.fulfilled.match(ms)) {
        toast.success(`Member created and enrolled in ${plans.find((p) => p.id === values.plan_id)?.name ?? "plan"}.`);
      } else {
        toast.warning(
          `Member created, but couldn't assign plan: ${(ms.payload as string) ?? "unknown error"}`,
        );
      }
    } else {
      toast.success("Member created");
    }

    reset();
    onSuccess?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title="Add Member"
        description="Enroll a new athlete into your gym."
      />
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormInput
            label="Full Name"
            icon="person"
            placeholder="e.g. John Doe"
            error={errors.name?.message}
            {...register("name")}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Phone"
              icon="call"
              placeholder="+91 90000 00000"
              type="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <FormInput
              label="Email"
              icon="mail"
              type="email"
              placeholder="optional"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <CustomSelect
                  label="Gender"
                  icon="wc"
                  placeholder="Select"
                  options={[
                    { label: "Male", value: "MALE" },
                    { label: "Female", value: "FEMALE" },
                    { label: "Other", value: "OTHERS" },
                  ]}
                  value={value || ""}
                  onChange={onChange}
                  error={errors.gender?.message}
                />
              )}
            />
            <FormInput
              label="Date of Birth"
              type="date"
              icon="cake"
              error={errors.dob?.message}
              {...register("dob")}
            />
          </div>

          <div className="rounded-2xl border border-outline-variant/10 bg-surface-container/40 overflow-hidden">
            {!assignMembership ? (
              <button
                type="button"
                onClick={() => setAssignMembership(true)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-surface-container-low/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon name="add" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      Add Membership
                    </p>
                    <p className="text-[11px] text-outline">
                      Assign a plan now (optional)
                    </p>
                  </div>
                </div>
                <Icon name="chevron_right" className="text-outline" />
              </button>
            ) : (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                      <Icon name="workspace_premium" size={18} fill />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        Membership
                      </p>
                      <p className="text-[11px] text-outline">
                        Will be created right after the member.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAssignMembership(false)}
                    className="text-xs font-bold text-outline hover:text-error transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormSelect
                    label="Plan"
                    placeholder="Select plan"
                    options={[
                      { label: "Select plan", value: "" },
                      ...plans.map((p) => ({
                        label: p.name,
                        value: p.id,
                      })),
                    ]}
                    error={errors.plan_id?.message}
                    {...register("plan_id")}
                  />
                  <FormInput
                    label="Start Date"
                    type="date"
                    error={errors.start_date?.message}
                    {...register("start_date")}
                  />
                </div>
              </div>
            )}
          </div>

          <FormTextarea
            label="Notes"
            placeholder="Internal notes (optional)"
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
              className="flex-[2] gap-2"
              loading={isSubmitting}
            >
              <Icon name="person_add" size={20} />
              {isSubmitting
                ? "Creating…"
                : assignMembership
                  ? "Create Member & Membership"
                  : "Create Member"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};
