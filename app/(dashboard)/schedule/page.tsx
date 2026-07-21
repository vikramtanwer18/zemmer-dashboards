"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CustomSelect } from "@/components/ui/custom-select";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/features/members/components/pagination";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { ClassDialog } from "@/features/classes/components/class-dialog";
import { CalendarGrid, CalendarLegend, type CalendarView } from "@/features/schedule/components/calendar-grid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteClass, fetchClasses } from "@/store/slices/classes.slice";
import { cancelBooking, createBooking, fetchBookings } from "@/store/slices/bookings.slice";
import { fetchMembers } from "@/store/slices/members.slice";
import type { BookingStatus, GymClass } from "@/lib/api/domain-types";
import { formatDateTime } from "@/lib/utils/format";

// --- Helpers for Schedule ---
function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).toISOString(); }
function endOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59).toISOString(); }
function startOfWeek(d: Date) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (date.getDay() + 6) % 7; // Monday = 0
  date.setDate(date.getDate() - day);
  return date;
}
function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function rangeLabel(view: CalendarView, anchor: Date) {
  if (view === "day") {
    return anchor.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }
  const start = startOfWeek(anchor);
  const end = addDays(start, 6);
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();
  const startStr = start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const endStr = end.toLocaleDateString(
    undefined,
    sameMonth
      ? { day: "numeric", year: sameYear ? undefined : "numeric" }
      : { month: "short", day: "numeric", year: sameYear ? undefined : "numeric" }
  );
  return `${startStr} – ${endStr}, ${end.getFullYear()}`;
}

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

export default function ScheduleAndBookingsPage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"calendar" | "classes" | "bookings">("calendar");

  // State for Schedule/Calendar
  const [calView, setCalView] = useState<CalendarView>("week");
  const [anchor, setAnchor] = useState(() => new Date());
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<GymClass | null>(null);
  const [seed, setSeed] = useState<{ start: Date; end: Date } | null>(null);

  const { list: classesList, listLoading: classesLoading, listError: classesError } = useAppSelector((s) => s.classes);
  
  // State for Bookings
  const { list: bookingsList, listLoading: bookingsLoading, listError: bookingsError, page: bookingsPage, limit: bookingsLimit, total: bookingsTotal, totalPages: bookingsTotalPages } = useAppSelector((s) => s.bookings);
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | "">("");
  const [bookingCurrentPage, setBookingCurrentPage] = useState(1);
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<GymClass | null>(null);
  const [cancelBookingConfirmOpen, setCancelBookingConfirmOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const debouncedBookingSearch = useDebounced(bookingSearch);

  // Queries
  const calFromTo = useMemo(() => {
    if (calView === "day") {
      return { from: startOfDay(anchor), to: endOfDay(anchor) };
    }
    const start = startOfWeek(anchor);
    const end = addDays(start, 6);
    return { from: startOfDay(start), to: endOfDay(end) };
  }, [calView, anchor]);

  const bookingQuery = useMemo(
    () => ({
      page: bookingCurrentPage,
      limit: 20,
      status: bookingStatus || undefined,
      search: debouncedBookingSearch || undefined,
    }),
    [bookingCurrentPage, bookingStatus, debouncedBookingSearch],
  );

  useEffect(() => {
    if (activeTab === "calendar") {
      dispatch(fetchClasses({ ...calFromTo, limit: 200 }));
    } else if (activeTab === "classes") {
      dispatch(fetchClasses({ limit: 50 }));
    } else if (activeTab === "bookings") {
      dispatch(fetchBookings(bookingQuery));
    }
  }, [dispatch, activeTab, calFromTo, bookingQuery]);

  useEffect(() => {
    setBookingCurrentPage(1);
  }, [bookingStatus, debouncedBookingSearch]);

  // Calendar Actions
  const reloadCalendar = () => dispatch(fetchClasses({ ...calFromTo, limit: 200 }));
  const goPrev = () => setAnchor((d) => addDays(d, calView === "day" ? -1 : -7));
  const goNext = () => setAnchor((d) => addDays(d, calView === "day" ? 1 : 7));
  
  // Handlers
  const handleSlotClick = (start: Date, end: Date) => {
    setEditingClass(null);
    setSeed({ start, end });
    setClassDialogOpen(true);
  };
  const handleCreateClassClick = () => {
    setEditingClass(null);
    setSeed(null);
    setClassDialogOpen(true);
  };
  const handleEditClass = (c: GymClass) => {
    setEditingClass(c);
    setClassDialogOpen(true);
  };
  
  const initiateDeleteClass = (c: GymClass) => {
    setClassToDelete(c);
    setDeleteConfirmOpen(true);
  };
  const executeDeleteClass = async () => {
    if (!classToDelete) return;
    const action = await dispatch(deleteClass(classToDelete.id));
    if (deleteClass.fulfilled.match(action)) {
      toast.success("Class deleted");
    } else {
      toast.error((action.payload as string) ?? "Unable to delete class");
    }
    setDeleteConfirmOpen(false);
    setClassToDelete(null);
  };

  const initiateCancelBooking = (id: string) => {
    setBookingToCancel(id);
    setCancelBookingConfirmOpen(true);
  };
  const executeCancelBooking = async () => {
    if (!bookingToCancel) return;
    const action = await dispatch(cancelBooking(bookingToCancel));
    if (cancelBooking.fulfilled.match(action)) {
      toast.success("Booking cancelled");
    } else {
      toast.error((action.payload as string) ?? "Unable to cancel");
    }
    setCancelBookingConfirmOpen(false);
    setBookingToCancel(null);
  };

  return (
    <div className="p-8 pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-on-surface">
            Operations
          </h2>
          <p className="text-sm text-outline font-medium">
            Manage schedule, classes, and member bookings all in one place.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="w-auto whitespace-nowrap px-6 h-11 rounded-xl font-bold border-outline-variant/20 hover:bg-surface-container-low transition-all"
            onClick={() => setNewBookingOpen(true)}
          >
            <Icon name="confirmation_number" size={18} className="text-primary mr-2" />
            New Booking
          </Button>
          <Button
            variant="primary"
            className="w-auto px-6 h-11 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            onClick={handleCreateClassClick}
          >
            <Icon name="add" size={18} className="mr-2" />
            Create Class
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/10 w-fit mb-8">
        {[
          { id: "calendar", label: "Schedule", icon: "calendar_month" },
          { id: "classes", label: "Classes", icon: "fitness_center" },
          { id: "bookings", label: "Bookings", icon: "confirmation_number" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-surface-container-lowest shadow-sm text-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <Icon name={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "calendar" && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-atmospheric overflow-hidden border border-outline-variant/10">
          <div className="p-4 md:px-6 flex flex-col md:flex-row items-center justify-between bg-surface-container-lowest border-b border-outline-variant/10 gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <h3 className="text-lg font-semibold text-on-surface whitespace-nowrap min-w-[180px]">
                {rangeLabel(calView, anchor)}
              </h3>

              <div className="flex items-center bg-surface-container-low rounded-lg p-0.5 border border-outline-variant/5">
                <button
                  onClick={goPrev}
                  className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary rounded-md transition-colors hover:bg-surface-container-lowest"
                  aria-label="Previous"
                >
                  <Icon name="chevron_left" size={18} />
                </button>
                <button
                  onClick={() => setAnchor(new Date())}
                  className="px-3 h-8 text-xs font-semibold text-on-surface hover:text-primary transition-colors hover:bg-surface-container-lowest rounded-md"
                >
                  Today
                </button>
                <button
                  onClick={goNext}
                  className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary rounded-md transition-colors hover:bg-surface-container-lowest"
                  aria-label="Next"
                >
                  <Icon name="chevron_right" size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="hidden xl:block">
                <CalendarLegend />
              </div>
              <div className="flex bg-surface-container-low p-0.5 rounded-lg border border-outline-variant/5">
                <button
                  onClick={() => setCalView("day")}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    calView === "day"
                      ? "bg-surface-container-lowest shadow-sm text-on-surface"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setCalView("week")}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    calView === "week"
                      ? "bg-surface-container-lowest shadow-sm text-on-surface"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Week
                </button>
              </div>
            </div>
          </div>

          {classesError ? (
            <ErrorState description={classesError} onRetry={reloadCalendar} />
          ) : classesLoading && classesList.length === 0 ? (
            <Skeleton className="h-[600px] rounded-none border-0" />
          ) : (
            <CalendarGrid
              view={calView}
              anchorDate={anchor}
              classes={classesList}
              onCreateAt={handleSlotClick}
            />
          )}
        </div>
      )}

      {activeTab === "classes" && (
        <div>
          {classesError ? (
            <ErrorState description={classesError} onRetry={() => dispatch(fetchClasses({ limit: 50 }))} />
          ) : classesLoading && classesList.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-3xl" />
              ))}
            </div>
          ) : classesList.length === 0 ? (
            <EmptyState
              icon="fitness_center"
              title="No classes scheduled"
              description="Create your first class to start accepting member bookings."
              action={
                <Button 
                  onClick={handleCreateClassClick} 
                  variant="primary" 
                  className="mt-6 h-11 px-8 rounded-xl font-bold shadow-lg shadow-primary/20"
                >
                  <Icon name="add" size={18} className="mr-2" />
                  Create Your First Class
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {classesList.map((c) => (
                <ClassCard key={c.id} gymClass={c} onEdit={() => handleEditClass(c)} onDelete={() => initiateDeleteClass(c)} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "bookings" && (
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
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
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
                const active = bookingStatus === tab.value;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setBookingStatus(tab.value as BookingStatus | "")}
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

          {bookingsError ? (
            <ErrorState description={bookingsError} onRetry={() => dispatch(fetchBookings(bookingQuery))} />
          ) : bookingsLoading && bookingsList.length === 0 ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : bookingsList.length === 0 ? (
            <EmptyState
              icon="confirmation_number"
              title="No bookings found"
              description="When members book classes they'll show up here."
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface/50 text-left border-b border-outline-variant/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Member</th>
                      <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Class</th>
                      <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Starts</th>
                      <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {bookingsList.map((b) => (
                      <tr key={b.id} className="border-b border-outline-variant/10 hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {b.member ? b.member.name.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div>
                              {b.member ? (
                                <Link href={`/members/${b.member.id}`} className="font-semibold text-on-surface hover:text-primary transition-colors text-base">
                                  {b.member.name}
                                </Link>
                              ) : (
                                <span className="font-semibold text-on-surface">Unknown</span>
                              )}
                              {b.member?.phone && <p className="text-xs text-on-surface-variant/70 font-medium mt-0.5">{b.member.phone}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium bg-surface-container-low px-2.5 py-1 rounded-md text-on-surface-variant border border-outline-variant/20 capitalize">
                            {b.class?.name ?? "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[b.status]}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant/70 font-medium text-sm">
                          {b.class?.starts_at ? formatDateTime(b.class.starts_at) : "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {b.status !== "CANCELLED" && (
                            <button
                              onClick={() => initiateCancelBooking(b.id)}
                              className="inline-flex items-center text-error hover:bg-error/10 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all active:scale-95"
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
              {bookingsTotal > 0 && (
                <Pagination
                  page={bookingsPage}
                  totalPages={bookingsTotalPages}
                  total={bookingsTotal}
                  limit={bookingsLimit}
                  onPageChange={setBookingCurrentPage}
                  itemLabel="bookings"
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Modals & Dialogs */}
      <ClassDialog
        isOpen={classDialogOpen}
        onClose={() => {
          setClassDialogOpen(false);
          setSeed(null);
          setEditingClass(null);
        }}
        gymClass={editingClass}
        initialStart={seed?.start.toISOString()}
        initialEnd={seed?.end.toISOString()}
      />
      <NewBookingDialog isOpen={newBookingOpen} onClose={() => setNewBookingOpen(false)} />
      
      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <Modal.Header 
          title="Delete Class" 
          description={`Are you sure you want to delete ${classToDelete?.name}? All bookings will be cancelled.`} 
        />
        <Modal.Body>
          <Modal.Footer>
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmOpen(false)}>
              Back
            </Button>
            <Button variant="primary" className="flex-1 bg-error hover:bg-error/90 text-on-error shadow-error/20" onClick={executeDeleteClass}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

      <Modal isOpen={cancelBookingConfirmOpen} onClose={() => setCancelBookingConfirmOpen(false)}>
        <Modal.Header 
          title="Cancel Booking" 
          description="Are you sure you want to cancel this booking?" 
        />
        <Modal.Body>
          <Modal.Footer>
            <Button variant="outline" className="flex-1" onClick={() => setCancelBookingConfirmOpen(false)}>
              Keep
            </Button>
            <Button variant="primary" className="flex-1 bg-error hover:bg-error/90 text-on-error shadow-error/20" onClick={executeCancelBooking}>
              Cancel Booking
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  );
}

// --- Class Card Component ---
function ClassCard({ gymClass, onEdit, onDelete }: { gymClass: GymClass; onEdit: () => void; onDelete: () => void; }) {
  const fillPercent = gymClass.capacity
    ? Math.min(100, Math.round(((gymClass.bookingsCount ?? 0) / gymClass.capacity) * 100))
    : 0;
  const isPast = new Date(gymClass.ends_at).getTime() < Date.now();

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 flex flex-col h-full border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow group">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon name="fitness_center" size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-on-surface leading-tight truncate group-hover:text-primary transition-colors">
              {gymClass.name}
            </h3>
            <p className="text-xs text-outline font-medium flex items-center gap-1 mt-1 truncate">
              <Icon name="person" size={12} className="shrink-0" />
              <span className="truncate">{gymClass.trainer?.name ?? "No Trainer"}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md border ${
            isPast ? "bg-surface-container-low text-outline border-outline-variant/20" : "bg-green-500/10 text-green-700 border-green-500/20"
          }`}>
            {isPast ? "Past" : "Upcoming"}
          </span>
          <button onClick={onDelete} className="w-8 h-8 rounded-lg bg-error/5 text-error hover:bg-error/10 flex items-center justify-center transition-colors">
            <Icon name="delete" size={16} />
          </button>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-surface-container-low/50 rounded-xl p-3 mb-5 border border-outline-variant/5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
          <Icon name="schedule" size={14} className="text-primary shrink-0" />
          <span className="truncate">{formatDateTime(gymClass.starts_at)}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-outline font-medium">
          <Icon name="event_busy" size={14} className="shrink-0" />
          <span className="truncate">{formatDateTime(gymClass.ends_at)}</span>
        </div>
      </div>

      {/* Capacity */}
      <div className="mb-5 mt-auto">
        <div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-wider mb-2">
          <span>Capacity</span>
          <span className="text-on-surface">{gymClass.bookingsCount ?? 0} <span className="text-outline/60">/ {gymClass.capacity}</span></span>
        </div>
        <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${fillPercent}%` }} />
        </div>
      </div>

      {/* Actions */}
      <div className="pt-5 border-t border-outline-variant/10">
        <Button variant="outline" onClick={onEdit} className="w-full h-10 text-xs font-bold tracking-wide group-hover:border-primary/30 group-hover:text-primary transition-colors">
          <Icon name="edit" size={16} className="mr-1.5" /> Edit Class
        </Button>
      </div>

    </div>
  );
}

// --- New Booking Dialog ---
function NewBookingDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
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

  const filtered = members.filter((m) =>
    !search.trim() || m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search)
  );

  const submit = async () => {
    if (!classId || !memberId) {
      toast.error("Pick a class and a member");
      return;
    }
    setSubmitting(true);
    const action = await dispatch(createBooking({ class_id: classId, member_id: memberId }));
    setSubmitting(false);
    if (createBooking.fulfilled.match(action)) {
      toast.success(action.payload.booking.status === "WAITLISTED" ? "Added to waitlist" : "Booking confirmed");
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
      <Modal.Header title="New Booking" description="Add a member to a class." />
      <Modal.Body>
        <div className="space-y-6">
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

          <div className="space-y-1.5">
            <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
              Member
            </label>
            <div className="relative">
              <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
              <input
                className="w-full h-12 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl py-3 pl-12 pr-4 text-sm focus:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline/60"
                placeholder="Search by name or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="mt-4 max-h-64 overflow-y-auto divide-y divide-outline-variant/10 border border-outline-variant/20 rounded-2xl shadow-inner bg-surface-container-lowest/50">
              {filtered.slice(0, 25).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMemberId(m.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
                    memberId === m.id
                      ? "bg-primary/10 text-primary border-l-4 border-l-primary"
                      : "hover:bg-surface-container-low border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      memberId === m.id ? "bg-primary text-on-primary shadow-md shadow-primary/30" : "bg-primary/10 text-primary"
                    }`}>
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${memberId === m.id ? "text-primary" : "text-on-surface"}`}>{m.name}</p>
                      <p className="text-xs text-outline font-medium mt-0.5">{m.phone}</p>
                    </div>
                  </div>
                  {memberId === m.id && <Icon name="check_circle" className="text-primary" size={24} />}
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="p-8 text-center text-outline">
                  <Icon name="person_off" size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-semibold">No members found</p>
                </div>
              )}
            </div>
          </div>

          <Modal.Footer>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="button" variant="primary" className="flex-1 gap-2 shadow-primary/20" loading={submitting} onClick={submit}>
              <Icon name="confirmation_number" size={18} />
              Book Class
            </Button>
          </Modal.Footer>
        </div>
      </Modal.Body>
    </Modal>
  );
}
