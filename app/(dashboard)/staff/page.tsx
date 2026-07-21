"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { FormInput } from "@/components/ui/form-input";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  EmptyState,
  ErrorState,
  Skeleton,
} from "@/components/ui/states";
import { Modal } from "@/components/ui/modal";
import { StaffDialog } from "@/features/staff/components/staff-dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteStaff, fetchStaff } from "@/store/slices/staff.slice";
import type { InstructorType, StaffMember } from "@/lib/api/domain-types";
import { formatCurrency, initialsFromName } from "@/lib/utils/format";

export default function StaffPage() {
  const dispatch = useAppDispatch();
  const { list, listLoading, listError } = useAppSelector((s) => s.staff);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<StaffMember | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<InstructorType | "">("");

  useEffect(() => {
    dispatch(
      fetchStaff({
        search: search || undefined,
        instructorType: typeFilter || undefined,
        limit: 50,
      }),
    );
  }, [dispatch, search, typeFilter]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (s: StaffMember) => {
    setEditing(s);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const action = await dispatch(deleteStaff(deleteConfirm.id));
    if (deleteStaff.fulfilled.match(action)) {
      toast.success("Staff deleted");
      setDeleteConfirm(null);
    } else {
      toast.error((action.payload as string) ?? "Unable to delete staff");
    }
  };

  return (
    <div className="p-8 pb-12 max-w-[1600px] mx-auto min-h-screen space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tighter mb-1">
            Staff
          </h2>
          <p className="text-sm text-outline font-medium">
            Manage your trainers and coaches.
          </p>
        </div>
        <Button
          variant="primary"
          className="h-11 max-w-[200px] px-6 text-xs shadow-lg shadow-primary/20"
          onClick={openCreate}
        >
          <Icon name="badge" size={18} />
          Add Staff
        </Button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-atmospheric overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 bg-surface/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <FormInput
                icon="search"
                placeholder="Search staff by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-52 z-20">
              <CustomSelect
                options={[
                  { label: "All Roles", value: "", icon: "group" },
                  { label: "Trainer", value: "TRAINER", icon: "fitness_center" },
                  { label: "Coach", value: "COACH", icon: "sports" },
                ]}
                value={typeFilter}
                onChange={(val) =>
                  setTypeFilter(val as InstructorType | "")
                }
              />
            </div>
          </div>
        </div>

        {listError ? (
          <div className="p-6">
            <ErrorState
              description={listError}
              onRetry={() => dispatch(fetchStaff({ limit: 50 }))}
            />
          </div>
        ) : listLoading && list.length === 0 ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon="badge"
            title="No staff yet"
            description="Onboard trainers and coaches to assign them to classes."
            action={
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
              >
                <Icon name="add" size={16} />
                Add Staff
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface/50 text-left border-b border-outline-variant/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Staff</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Rate</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant/10">
                {list.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-primary/[0.02] transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary/20">
                          {initialsFromName(s.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface text-sm leading-tight group-hover:text-primary transition-colors">
                            {s.name}
                          </p>
                          {s.bio && (
                            <p className="text-xs text-outline font-medium mt-0.5 line-clamp-1 max-w-[200px]" title={s.bio}>
                              {s.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        s.instructorType === "TRAINER" 
                          ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
                          : "bg-purple-500/10 text-purple-700 border-purple-500/20"
                      }`}>
                        {s.instructorType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-medium text-xs">
                      <div className="text-sm">{s.phone}</div>
                      {s.email && <div className="text-outline mt-0.5">{s.email}</div>}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-medium text-sm">
                      {s.hourlyPrice != null && s.hourlyPrice > 0 ? (
                        <span className="font-semibold text-primary">{formatCurrency(s.hourlyPrice)}<span className="text-xs text-outline font-medium">/hr</span></span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEdit(s)}
                        className="inline-flex items-center text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all active:scale-95"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(s)}
                        className="inline-flex items-center text-error hover:bg-error/10 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all active:scale-95"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StaffDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        staff={editing}
      />

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <Modal.Header 
          title="Delete Staff" 
          description="Are you sure you want to remove this staff member? This action cannot be undone." 
        />
        <Modal.Body>
          {deleteConfirm && (
            <div className="bg-error/10 border border-error/20 p-4 rounded-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-error/20 text-error flex items-center justify-center shrink-0">
                <Icon name="warning" size={24} />
              </div>
              <div>
                <p className="text-on-surface font-bold">Remove {deleteConfirm.name}?</p>
                <p className="text-sm text-on-surface-variant mt-1">
                  They will lose access to the platform and be unassigned from all current classes.
                </p>
              </div>
            </div>
          )}
          <Modal.Footer>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  );
}
