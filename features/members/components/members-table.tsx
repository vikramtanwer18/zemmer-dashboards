"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import type { Member, MemberStatus } from "@/lib/api/domain-types";
import { formatRelative } from "@/lib/utils/format";
import { initialsFromName } from "@/lib/utils/format";

interface MembersTableProps {
  members: Member[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onAddMember?: () => void;
}

const statusStyles: Record<MemberStatus, string> = {
  ACTIVE: "text-green-600 bg-green-500/10 border-green-500/20",
  SUSPENDED: "text-tertiary bg-tertiary/10 border-tertiary/20",
  CHURNED: "text-error bg-error/10 border-error/20",
};

const statusDot: Record<MemberStatus, string> = {
  ACTIVE: "bg-green-600",
  SUSPENDED: "bg-tertiary",
  CHURNED: "bg-error",
};

const MemberRow: React.FC<{ member: Member }> = ({ member }) => {
  return (
    <tr className="hover:bg-primary/[0.02] transition-colors duration-200 group/row">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 transition-transform duration-300 group-hover/row:scale-105 group-hover/row:bg-primary/20">
            {initialsFromName(member.name)}
          </div>
          <div>
            <p className="font-semibold text-on-surface text-sm leading-tight group-hover/row:text-primary transition-colors">
              {member.name}
            </p>
            <p className="text-xs text-outline font-medium mt-0.5">
              {member.email || "—"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-on-surface-variant font-medium text-sm tabular-nums">
        {member.phone}
      </td>
      <td className="px-6 py-4">
        <span className="text-xs font-medium bg-surface-container-low px-2.5 py-1 rounded-md text-on-surface-variant border border-outline-variant/20">
          {member.currentPlanName ?? "—"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div
          className={`flex items-center gap-1.5 font-medium text-xs w-fit px-2.5 py-1 rounded-full border ${statusStyles[member.status]}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${statusDot[member.status]} ${member.status === "CHURNED" ? "animate-pulse" : ""}`}
          />
          {member.status}
        </div>
      </td>
      <td className="px-6 py-4 text-on-surface-variant/70 font-medium text-sm">
        {member.lastVisitAt ? formatRelative(member.lastVisitAt) : "—"}
      </td>
      <td className="px-6 py-4 text-right">
        <Link
          href={`/members/${member.id}`}
          className="inline-flex items-center gap-1.5 text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all active:scale-95"
        >
          View
          <Icon name="arrow_forward" size={16} />
        </Link>
      </td>
    </tr>
  );
};

export const MembersTable: React.FC<MembersTableProps> = ({
  members,
  loading,
  error,
  onRetry,
  onAddMember,
}) => {
  if (error) {
    return <ErrorState description={error} onRetry={onRetry} />;
  }

  if (loading && members.length === 0) {
    return (
      <div className="p-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    );
  }

  if (!loading && members.length === 0) {
    return (
      <EmptyState
        icon="group_add"
        title="No members yet"
        description="Add your first member to start tracking attendance and memberships."
        action={
          onAddMember ? (
            <button
              onClick={onAddMember}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90"
            >
              <Icon name="person_add" size={16} />
              Add Member
            </button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface/50 text-left border-b border-outline-variant/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">
              Member
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">
              Phone
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">
              Plan
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">
              Last Visit
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-outline-variant/10">
          {members.map((member) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
