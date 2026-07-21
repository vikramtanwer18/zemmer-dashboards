"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  FormInput,
  FormTextarea,
} from "@/components/ui/form-input";
import { CustomSelect } from "@/components/ui/custom-select";
import { staffSchema, type StaffInput } from "@/lib/validators/staff";
import { useAppDispatch } from "@/store/hooks";
import { createStaff, updateStaff } from "@/store/slices/staff.slice";
import type { StaffMember } from "@/lib/api/domain-types";

interface StaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffMember | null;
}

type StaffFormInput = z.input<typeof staffSchema>;

export const StaffDialog: React.FC<StaffDialogProps> = ({
  isOpen,
  onClose,
  staff,
}) => {
  const dispatch = useAppDispatch();
  const isEdit = !!staff;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<StaffFormInput, unknown, StaffInput>({
    resolver: zodResolver(staffSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      instructorType: "TRAINER",
      hourlyPrice: 0,
      address: "",
      dob: "",
      sex: undefined,
      bio: "",
      certificate: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: staff?.name ?? "",
        email: staff?.email ?? "",
        phone: staff?.phone ?? "",
        instructorType: staff?.instructorType ?? "TRAINER",
        hourlyPrice: staff?.hourlyPrice ?? 0,
        address: staff?.address ?? "",
        dob: staff?.dob ? staff.dob.slice(0, 10) : "",
        sex: staff?.sex ?? undefined,
        bio: staff?.bio ?? "",
        certificate: staff?.certificate ?? "",
      });
    }
  }, [isOpen, staff, reset]);

  const onSubmit = async (values: StaffInput) => {
    const payload = {
      ...values,
      address: values.address || undefined,
      dob: values.dob || undefined,
      bio: values.bio || undefined,
      certificate: values.certificate || undefined,
    };
    const action = isEdit
      ? await dispatch(updateStaff({ id: staff!.id, patch: payload }))
      : await dispatch(createStaff(payload));
    if (
      (isEdit && updateStaff.fulfilled.match(action)) ||
      (!isEdit && createStaff.fulfilled.match(action))
    ) {
      toast.success(isEdit ? "Staff updated" : "Staff created");
      reset();
      onClose();
    } else {
      toast.error(
        (action.payload as string) ??
          (isEdit ? "Unable to update staff." : "Unable to create staff."),
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title={isEdit ? "Edit Staff" : "Add Staff"}
        description={
          isEdit
            ? "Update trainer or coach details."
            : "Onboard a new trainer or coach."
        }
      />
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormInput
            label="Full Name *"
            icon="person"
            placeholder="e.g. John Doe"
            error={errors.name?.message}
            {...register("name")}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Email *"
              icon="mail"
              type="email"
              placeholder="e.g. john@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <FormInput
              label="Phone *"
              icon="call"
              type="tel"
              placeholder="e.g. 9876543210"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="instructorType"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Role *"
                  options={[
                    { label: "Trainer", value: "TRAINER", icon: "fitness_center" },
                    { label: "Coach", value: "COACH", icon: "sports" },
                  ]}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors.instructorType?.message}
                />
              )}
            />
            <FormInput
              label="Hourly Rate (₹) *"
              type="number"
              min={0}
              placeholder="e.g. 500"
              error={errors.hourlyPrice?.message}
              {...register("hourlyPrice")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Sex"
                  placeholder="Select"
                  options={[
                    { label: "Male", value: "MALE", icon: "male" },
                    { label: "Female", value: "FEMALE", icon: "female" },
                    { label: "Other", value: "OTHERS", icon: "transgender" },
                  ]}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors.sex?.message}
                />
              )}
            />
            <FormInput
              label="DOB"
              type="date"
              icon="cake"
              error={errors.dob?.message}
              {...register("dob")}
            />
          </div>

          <FormInput
            label="Address *"
            icon="home"
            placeholder="e.g. 123, Gym Street, City"
            error={errors.address?.message}
            {...register("address")}
          />

          <FormInput
            label="Certificate URL"
            icon="verified"
            placeholder="https://…"
            error={errors.certificate?.message}
            {...register("certificate")}
          />

          <FormTextarea
            label="Bio"
            placeholder="Specialties, experience, etc."
            error={errors.bio?.message}
            {...register("bio")}
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
              disabled={!isValid || isSubmitting}
            >
              <Icon name={isEdit ? "save" : "badge"} size={18} />
              {isSubmitting ? "Saving…" : isEdit ? "Save Staff" : "Add Staff"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};
