"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  FormInput,
} from "@/components/ui/form-input";
import { CustomSelect } from "@/components/ui/custom-select";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/features/members/components/pagination";
import {
  EmptyState,
  ErrorState,
  Skeleton,
} from "@/components/ui/states";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  cancelBooking,
  createBooking,
  fetchBookings,
} from "@/store/slices/bookings.slice";
import { fetchClasses } from "@/store/slices/classes.slice";
import { fetchMembers } from "@/store/slices/members.slice";
import type { BookingStatus } from "@/lib/api/domain-types";
import { formatDateTime } from "@/lib/utils/format";

const statusColors: Record<BookingStatus, string> = {
  CONFIRMED: "bg-green-500/10 text-green-700 border-green-500/20",
  WAITLISTED: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  CANCELLED: "bg-outline-variant/20 text-outline border-outline-variant/30",
};

function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const { list, listLoading, listError, page, limit, total, totalPages } =
    useAppSelector((s) => s.bookings);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BookingStatus | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newOpen, setNewOpen] = useState(false);

  const debouncedSearch = useDebounced(search);

  const query = useMemo(
    () => ({
      page: currentPage,
      limit: 20,
      status: status || undefined,
      search: debouncedSearch || undefined,
    }),
    [currentPage, status, debouncedSearch],
  );

  useEffect(() => {
    dispatch(fetchBookings(query));
  }, [dispatch, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [status, debouncedSearch]);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    const action = await dispatch(cancelBooking(id));
    if (cancelBooking.fulfilled.match(action)) {
      toast.success("Booking cancelled");
    } else {
      toast.error((action.payload as string) ?? "Unable to cancel");
    }
  };

  return (
    <div className="p-8 pb-12 max-w-[1600px] mx-auto min-h-screen space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tighter mb-1">
            Bookings
          </h2>
          <p className="text-sm text-outline font-medium">
            Manage member bookings across all classes.
          </p>
        </div>
        <Button
          variant="primary"
          className="h-11 max-w-[200px] px-6 text-xs shadow-lg shadow-primary/20"
          onClick={() => setNewOpen(true)}
        >
          <Icon name="add" size={18} />
          New Booking
        </Button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-atmospheric overflow-hidden border border-outline-variant/10">
        <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container-lowest border-b border-outline-variant/10">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                className="w-full bg-surface-container-low border-none rounded-lg py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Search by member, class, or phone..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            {[
              { label: "All", value: "" },
              { label: "Confirmed", value: "CONFIRMED" },
              { label: "Waitlisted", value: "WAITLISTED" },
              { label: "Cancelled", value: "CANCELLED" },
            ].map((tab) => {
              const active = status === tab.value;
              return (
                <button
                  key={tab.label}
                  onClick={() => setStatus(tab.value as BookingStatus | "")}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    active
                      ? "bg-primary-container text-on-primary"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {listError ? (
          <ErrorState
            description={listError}
            onRetry={() => dispatch(fetchBookings(query))}
          />
        ) : listLoading && list.length === 0 ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon="confirmation_number"
            title="No bookings"
            description="When members book classes they'll show up here."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container-low/50 text-left border-b border-outline-variant/10">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-outline">Member</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-outline">Class</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-outline">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-outline">Starts</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-outline text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-outline-variant/10">
                  {list.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-surface-container-low transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-on-surface">
                        {b.member ? (
                          <Link
                            href={`/members/${b.member.id}`}
                            className="hover:text-primary"
                          >
                            {b.member.name}
                          </Link>
                        ) : (
                          <span className="text-outline">Unknown</span>
                        )}
                        {b.member?.phone && (
                          <p className="text-[10px] text-outline font-medium">
                            {b.member.phone}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-on-surface font-semibold">
                        {b.class?.name ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${statusColors[b.status]}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-outline">
                        {b.class?.starts_at
                          ? formatDateTime(b.class.starts_at)
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {b.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-error hover:bg-error/10"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {total > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                limit={limit}
                onPageChange={setCurrentPage}
                itemLabel="bookings"
              />
            )}
          </>
        )}
      </div>

      <NewBookingDialog
        isOpen={newOpen}
        onClose={() => setNewOpen(false)}
      />
    </div>
  );
}

function NewBookingDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const classes = useAppSelector((s) => s.classes.list);
  const members = useAppSelector((s) => s.members.list);

  const [classId, setClassId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (classes.length === 0) dispatch(fetchClasses({ limit: 50 }));
      if (members.length === 0) dispatch(fetchMembers({ limit: 50 }));
    }
  }, [isOpen, classes.length, members.length, dispatch]);

  const filtered = members.filter(
    (m) =>
      !search.trim() ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search),
  );

  const submit = async () => {
    if (!classId || !memberId) {
      toast.error("Pick a class and a member");
      return;
    }
    setSubmitting(true);
    const action = await dispatch(
      createBooking({ class_id: classId, member_id: memberId }),
    );
    setSubmitting(false);
    if (createBooking.fulfilled.match(action)) {
      toast.success(
        action.payload.booking.status === "WAITLISTED"
          ? "Added to waitlist"
          : "Booking confirmed",
      );
      setClassId("");
      setMemberId("");
      setSearch("");
      onClose();
    } else {
      toast.error((action.payload as string) ?? "Booking failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title="New Booking"
        description="Add a member to a class."
      />
      <Modal.Body>
        <div className="space-y-5">
          <CustomSelect
            label="Class"
            placeholder="Select class"
            options={classes.map((c) => ({
              label: `${c.name} · ${formatDateTime(c.starts_at)}`,
              value: c.id,
              icon: "fitness_center",
            }))}
            value={classId}
            onChange={(val) => setClassId(val)}
          />

          <div>
            <FormInput
              label="Member"
              icon="search"
              placeholder="Search by name or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="mt-3 max-h-56 overflow-y-auto divide-y divide-outline-variant/10 border border-outline-variant/10 rounded-xl">
              {filtered.slice(0, 25).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMemberId(m.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                    memberId === m.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-surface-container-low"
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm">{m.name}</p>
                    <p className="text-xs text-outline">{m.phone}</p>
                  </div>
                  {memberId === m.id && (
                    <Icon name="check_circle" className="text-primary" />
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-outline italic py-6 text-center">
                  No members found.
                </p>
              )}
            </div>
          </div>

          <Modal.Footer>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              className="flex-1 gap-2"
              loading={submitting}
              onClick={submit}
            >
              <Icon name="confirmation_number" size={18} />
              Book
            </Button>
          </Modal.Footer>
        </div>
      </Modal.Body>
    </Modal>
  );
}
