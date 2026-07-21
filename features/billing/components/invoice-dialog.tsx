"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { CustomSelect } from "@/components/ui/custom-select";
import { invoiceSchema, type InvoiceInput } from "@/lib/validators/billing";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createInvoice } from "@/store/slices/billing.slice";
import { fetchRevenueAnalytics } from "@/store/slices/analytics.slice";
import { fetchMembers } from "@/store/slices/members.slice";

interface InvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceDialog: React.FC<InvoiceDialogProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const members = useAppSelector((s) => s.members.list);
  const loadingMembers = useAppSelector((s) => s.members.listLoading);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      member_id: "",
      amount_paise: 0,
      due_date: new Date().toISOString().split("T")[0],
      status: "PENDING",
      grace_days: 3,
    },
  });

  useEffect(() => {
    if (isOpen && members.length === 0) {
      dispatch(fetchMembers({ limit: 100 }));
    }
  }, [isOpen, members.length, dispatch]);

  const onSubmit = async (values: InvoiceInput) => {
    // Convert Rupees to Paise
    const payload = {
      ...values,
      amount_paise: Math.round(values.amount_paise * 100),
    };

    const action = await dispatch(createInvoice(payload));

    if (createInvoice.fulfilled.match(action)) {
      toast.success("Invoice created successfully");
      dispatch(fetchRevenueAnalytics());
      reset();
      onClose();
    } else {
      toast.error((action.payload as string) ?? "Unable to create invoice.");
    }
  };

  const selectedMemberId = watch("member_id");
  const selectedStatus = watch("status");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title="Create Invoice"
        description="Generate a new invoice for a member."
      />
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-outline">
              Member
            </label>
            <CustomSelect
              value={selectedMemberId}
              onChange={(val) => setValue("member_id", val, { shouldValidate: true })}
              options={[
                { label: "Select a member", value: "" },
                ...members.map((m) => ({ label: m.name, value: m.id })),
              ]}
              isLoading={loadingMembers}
              error={errors.member_id?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Amount (₹)"
              type="number"
              min={0}
              placeholder="1000"
              error={errors.amount_paise?.message}
              {...register("amount_paise")}
            />
            <FormInput
              label="Due Date"
              type="date"
              error={errors.due_date?.message}
              {...register("due_date")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-outline">
                Status
              </label>
              <CustomSelect
                value={selectedStatus}
                onChange={(val) => setValue("status", val as any, { shouldValidate: true })}
                options={[
                  { label: "Pending", value: "PENDING" },
                  { label: "Paid", value: "PAID" },
                ]}
                error={errors.status?.message}
              />
            </div>
            <FormInput
              label="Grace Days"
              type="number"
              min={0}
              placeholder="3"
              error={errors.grace_days?.message}
              {...register("grace_days")}
            />
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
              <Icon name="add_circle" size={18} />
              {isSubmitting ? "Creating…" : "Create Invoice"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};
