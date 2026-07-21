"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { CustomSelect } from "@/components/ui/custom-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/ui/form-input";
import { classSchema, type ClassInput } from "@/lib/validators/classes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createClass, updateClass } from "@/store/slices/classes.slice";
import { fetchStaff } from "@/store/slices/staff.slice";
import type { GymClass } from "@/lib/api/domain-types";

interface ClassDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gymClass?: GymClass | null;
  initialStart?: string;
  initialEnd?: string;
}

type ClassFormInput = z.input<typeof classSchema>;

const toLocalInput = (iso: string): string => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const ClassDialog: React.FC<ClassDialogProps> = ({
  isOpen,
  onClose,
  gymClass,
  initialStart,
  initialEnd,
}) => {
  const dispatch = useAppDispatch();
  const staff = useAppSelector((s) => s.staff.list);
  const isEdit = !!gymClass;

  useEffect(() => {
    if (isOpen && staff.length === 0) {
      dispatch(fetchStaff({ limit: 100 }));
    }
  }, [isOpen, staff.length, dispatch]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ClassFormInput, unknown, ClassInput>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      trainer_id: "",
      starts_at: "",
      ends_at: "",
      capacity: 20,
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      const startSeed =
        gymClass?.starts_at ?? (initialStart ? initialStart : null);
      const endSeed = gymClass?.ends_at ?? (initialEnd ? initialEnd : null);
      reset({
        name: gymClass?.name ?? "",
        trainer_id: gymClass?.trainer_id ?? "",
        starts_at: startSeed ? toLocalInput(startSeed) : "",
        ends_at: endSeed ? toLocalInput(endSeed) : "",
        capacity: gymClass?.capacity ?? 20,
        description: gymClass?.description ?? "",
      });
    }
  }, [isOpen, gymClass, initialStart, initialEnd, reset]);

  const onSubmit = async (values: ClassInput) => {
    const payload = {
      ...values,
      starts_at: new Date(values.starts_at).toISOString(),
      ends_at: new Date(values.ends_at).toISOString(),
      description: values.description || undefined,
    };
    const action = isEdit
      ? await dispatch(updateClass({ id: gymClass!.id, patch: payload }))
      : await dispatch(createClass(payload));
    if (
      (isEdit && updateClass.fulfilled.match(action)) ||
      (!isEdit && createClass.fulfilled.match(action))
    ) {
      toast.success(isEdit ? "Class updated" : "Class created");
      reset();
      onClose();
    } else {
      toast.error(
        (action.payload as string) ??
          (isEdit ? "Unable to update class." : "Unable to create class."),
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title={isEdit ? "Edit Class" : "Create Class"}
        description={
          isEdit
            ? "Update schedule, trainer, or capacity."
            : "Schedule a new class for members to book."
        }
      />
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormInput
            label="Class Name"
            icon="fitness_center"
            placeholder="HIIT 6 PM"
            error={errors.name?.message}
            {...register("name")}
          />
          <Controller
            control={control}
            name="trainer_id"
            render={({ field: { value, onChange } }) => (
              <CustomSelect
                label="Trainer *"
                value={value}
                onChange={onChange}
                options={staff.map((s) => ({
                  label: `${s.name} (${s.instructorType})`,
                  value: s.id,
                }))}
                placeholder="Select trainer"
                error={errors.trainer_id?.message}
              />
            )}
          />
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Starts at"
                type="datetime-local"
                error={errors.starts_at?.message}
                {...register("starts_at")}
              />
              <FormInput
                label="Ends at"
                type="datetime-local"
                error={errors.ends_at?.message}
                {...register("ends_at")}
              />
            </div>
            <p className="text-[11px] text-outline ml-1 flex items-center gap-1.5">
              <Icon name="info" size={14} className="text-primary" />
              Tip: <span className="font-bold">12:00 AM is midnight</span>. For noon, pick <span className="font-bold">12:00 PM</span>.
            </p>
          </div>
          <FormInput
            label="Capacity"
            type="number"
            min={1}
            error={errors.capacity?.message}
            {...register("capacity")}
          />
          <FormTextarea
            label="Description"
            placeholder="Optional"
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
              {isSubmitting ? "Saving…" : isEdit ? "Save Class" : "Create Class"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};
