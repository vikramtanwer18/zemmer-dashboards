"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { initialsFromName } from "@/lib/utils/format";
import type { GymClass } from "@/lib/api/domain-types";

const DAY_START_HOUR = 6;
const DAY_END_HOUR = 23;
const HOUR_HEIGHT = 56;
const TOTAL_HEIGHT = (DAY_END_HOUR - DAY_START_HOUR) * HOUR_HEIGHT;

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfWeek(d: Date) {
  // Monday-based week
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  return date;
}

function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function minutesFromDayStart(d: Date) {
  return (d.getHours() - DAY_START_HOUR) * 60 + d.getMinutes();
}

export type CalendarView = "day" | "week";

export interface CalendarGridProps {
  view: CalendarView;
  anchorDate: Date;
  classes: GymClass[];
  onCreateAt?: (start: Date, end: Date) => void;
}

export function CalendarGrid({
  view,
  anchorDate,
  classes,
  onCreateAt,
}: CalendarGridProps) {
  const days = useMemo(() => {
    if (view === "day") return [anchorDate];
    const start = startOfWeek(anchorDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [view, anchorDate]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, GymClass[]>();
    for (const day of days) map.set(day.toDateString(), []);
    for (const c of classes) {
      const start = new Date(c.starts_at);
      if (isNaN(start.getTime())) continue;
      const key = start.toDateString();
      if (!map.has(key)) continue;
      map.get(key)!.push(c);
    }
    return map;
  }, [days, classes]);

  const today = useMemo(() => new Date(), []);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to ~7am on first paint so the user lands inside the day window
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const targetHour = today.getHours();
    const offset = Math.max(0, (targetHour - DAY_START_HOUR - 1) * HOUR_HEIGHT);
    el.scrollTop = offset;
  }, [today]);

  return (
    <div className="bg-surface-container-lowest overflow-hidden flex flex-col h-full">
      <div className="grid border-b border-outline-variant/10 bg-surface-container-lowest"
        style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))` }}
      >
        <div className="h-16" />
        {days.map((d) => (
          <DayHeader key={d.toISOString()} date={d} isToday={isSameDay(d, today)} />
        ))}
      </div>

      <div
        ref={scrollerRef}
        className="overflow-auto max-h-[calc(100vh-260px)] no-scrollbar pt-3"
      >
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))`,
            height: TOTAL_HEIGHT,
          }}
        >
          <HoursColumn />
          {days.map((d) => (
            <DayColumn
              key={d.toISOString()}
              date={d}
              isToday={isSameDay(d, today)}
              now={today}
              events={eventsByDay.get(d.toDateString()) ?? []}
              onCreateAt={onCreateAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DayHeader({ date, isToday }: { date: Date; isToday: boolean }) {
  const day = date.toLocaleDateString(undefined, { weekday: "short" });
  const num = date.getDate();
  return (
    <div className="h-16 flex flex-col items-center justify-center border-l border-outline-variant/10 pt-1">
      <span
        className={`text-[11px] font-semibold mb-0.5 ${
          isToday ? "text-primary" : "text-outline"
        }`}
      >
        {day}
      </span>
      <span
        className={`text-lg w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
          isToday
            ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/30"
            : "text-on-surface font-medium hover:bg-surface-container-low"
        }`}
      >
        {num}
      </span>
    </div>
  );
}

function HoursColumn() {
  const hours = Array.from(
    { length: DAY_END_HOUR - DAY_START_HOUR },
    (_, i) => DAY_START_HOUR + i,
  );
  return (
    <div className="relative">
      {hours.map((h) => (
        <div
          key={h}
          className="text-[11px] font-medium text-outline text-right pr-2 border-t border-outline-variant/10"
          style={{ height: HOUR_HEIGHT, marginTop: h === DAY_START_HOUR ? 0 : 0 }}
        >
          <span className="-translate-y-2.5 inline-block bg-surface-container-lowest px-1">
            {h === 0
              ? "12 AM"
              : h < 12
                ? `${h} AM`
                : h === 12
                  ? "12 PM"
                  : `${h - 12} PM`}
          </span>
        </div>
      ))}
    </div>
  );
}

function DayColumn({
  date,
  isToday,
  now,
  events,
  onCreateAt,
}: {
  date: Date;
  isToday: boolean;
  now: Date;
  events: GymClass[];
  onCreateAt?: (start: Date, end: Date) => void;
}) {
  const handleCreate = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onCreateAt) return;
    if ((e.target as HTMLElement).closest("[data-event]")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top + e.currentTarget.scrollTop;
    const minutes = Math.max(0, (offsetY / HOUR_HEIGHT) * 60);
    const slot = Math.floor(minutes / 30) * 30;
    const start = new Date(date);
    start.setHours(DAY_START_HOUR, 0, 0, 0);
    start.setMinutes(slot);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    onCreateAt(start, end);
  };

  const positioned = layoutEvents(events);

  return (
    <div
      className="relative border-l border-outline-variant/10 cursor-pointer hover:bg-surface-container-low/20 transition-colors group"
      onClick={handleCreate}
    >
      {Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, i) => (
        <div
          key={i}
          className="border-t border-outline-variant/10"
          style={{ height: HOUR_HEIGHT }}
        />
      ))}

      {isToday && now.getHours() >= DAY_START_HOUR && now.getHours() < DAY_END_HOUR && (
        <NowLine now={now} />
      )}

      {positioned.map(({ event, top, height, left, width }) => (
        <EventBlock
          key={event.id}
          event={event}
          top={top}
          height={height}
          left={left}
          width={width}
        />
      ))}
    </div>
  );
}

function NowLine({ now }: { now: Date }) {
  const top = (minutesFromDayStart(now) / 60) * HOUR_HEIGHT;
  if (top < 0 || top > TOTAL_HEIGHT) return null;
  return (
    <div
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{ top }}
    >
      <div className="relative">
        <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-error shadow" />
        <div className="h-[2px] bg-error" />
      </div>
    </div>
  );
}

interface PositionedEvent {
  event: GymClass;
  top: number;
  height: number;
  left: number;
  width: number;
}

function layoutEvents(events: GymClass[]): PositionedEvent[] {
  if (events.length === 0) return [];
  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
  );

  // Build columns: place each event in the leftmost column where it doesn't overlap.
  const columns: GymClass[][] = [];
  const colByEvent = new Map<string, number>();

  for (const ev of sorted) {
    const evStart = new Date(ev.starts_at).getTime();
    let placed = false;
    for (let c = 0; c < columns.length; c++) {
      const last = columns[c][columns[c].length - 1];
      if (new Date(last.ends_at).getTime() <= evStart) {
        columns[c].push(ev);
        colByEvent.set(ev.id, c);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([ev]);
      colByEvent.set(ev.id, columns.length - 1);
    }
  }

  const colCount = columns.length || 1;
  const colWidth = 100 / colCount;

  return sorted.map((event) => {
    const start = new Date(event.starts_at);
    const end = new Date(event.ends_at);
    const startMin = minutesFromDayStart(start);
    const endMin = minutesFromDayStart(end);
    const top = Math.max(0, (startMin / 60) * HOUR_HEIGHT);
    const rawHeight = ((endMin - startMin) / 60) * HOUR_HEIGHT;
    const height = Math.max(rawHeight, 24);
    const col = colByEvent.get(event.id) ?? 0;
    return {
      event,
      top,
      height,
      left: col * colWidth,
      width: colWidth,
    };
  });
}

function EventBlock({
  event,
  top,
  height,
  left,
  width,
}: PositionedEvent) {
  const start = new Date(event.starts_at);
  const end = new Date(event.ends_at);
  const startLabel = start.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const endLabel = end.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const isPast = end.getTime() < Date.now();
  const fillPercent =
    event.capacity > 0
      ? Math.min(100, ((event.bookingsCount ?? 0) / event.capacity) * 100)
      : 0;

  return (
    <Link
      data-event
      href={`/operations/sessions/${event.id}`}
      onClick={(e) => e.stopPropagation()}
      className={`absolute z-10 rounded-md overflow-hidden flex flex-col transition-all hover:z-20 hover:shadow-md hover:ring-2 hover:ring-primary/20 ${
        isPast
          ? "bg-surface-container-low border border-outline-variant/10 text-outline"
          : "bg-primary/5 border border-primary/20 border-l-4 border-l-primary text-on-surface"
      }`}
      style={{
        top,
        height,
        left: `calc(${left}% + 2px)`,
        width: `calc(${width}% - 5px)`,
      }}
      title={`${event.name} · ${startLabel}–${endLabel}`}
    >
      <div className="px-2 py-1.5 flex-1 min-h-0">
        <p className={`text-xs font-bold truncate ${isPast ? "text-outline" : "text-primary"}`}>{event.name}</p>
        <p
          className={`text-[10px] font-medium truncate mt-0.5 ${isPast ? "text-outline/70" : "text-on-surface-variant"}`}
        >
          {startLabel} – {endLabel}
        </p>
        {event.trainer && height > 56 && (
          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-on-surface-variant">
            <Icon name="person" size={12} className="opacity-70" />
            <span className="truncate">{event.trainer.name}</span>
          </div>
        )}
      </div>
      {height > 40 && event.capacity > 0 && (
        <div className="h-1 bg-surface-container-high w-full">
          <div
            className={`h-full ${isPast ? "bg-outline-variant" : "bg-primary"}`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      )}
    </Link>
  );
}

export function CalendarLegend() {
  return (
    <div className="flex items-center gap-5 text-[11px] text-outline font-medium">
      <span className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-sm bg-primary/10 border-l-2 border-primary" />
        Upcoming
      </span>
      <span className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-sm bg-surface-container-low border border-outline-variant/20" />
        Past
      </span>
      <span className="flex items-center gap-2">
        <span className="w-3 h-[2px] bg-error" />
        Now
      </span>
      <span className="flex items-center gap-1.5">
        <Icon name="add_circle" size={14} className="text-primary" />
        Click empty slot to create
      </span>
    </div>
  );
}
