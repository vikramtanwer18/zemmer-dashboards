"use client";

import React, { useEffect, useMemo, useState } from "react";
import { StatsHighlights } from "@/features/members/components/stats-highlights";
import { TableFilters } from "@/features/members/components/table-filters";
import { MembersTable } from "@/features/members/components/members-table";
import { Pagination } from "@/features/members/components/pagination";
import { AddMemberDialog } from "@/features/members/components/add-member-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMembers } from "@/store/slices/members.slice";
import { fetchOverview } from "@/store/slices/analytics.slice";
import type { MemberStatus } from "@/lib/api/domain-types";

function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function MembersPage() {
  const dispatch = useAppDispatch();
  const { list, listLoading, listError, page, limit, total, totalPages } =
    useAppSelector((s) => s.members);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MemberStatus | "">("");
  const [currentPage, setCurrentPage] = useState(1);

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
    dispatch(fetchMembers(query));
  }, [dispatch, query]);

  useEffect(() => {
    dispatch(fetchOverview());
  }, [dispatch]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status]);

  return (
    <div className="p-8 pb-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-on-surface">
            Members
          </h2>
          <p className="text-sm text-outline font-medium">
            Manage your community and member records.
          </p>
        </div>
        <Button
          variant="primary"
          className="max-w-[200px] px-6 h-11 text-xs shadow-lg shadow-primary/20"
          onClick={() => setIsAddMemberOpen(true)}
        >
          <Icon name="person_add" size={18} />
          Add Member
        </Button>
      </div>

      <StatsHighlights />

      <div className="bg-surface-container-lowest rounded-2xl shadow-atmospheric overflow-hidden border border-outline-variant/10">
        <TableFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />
        <MembersTable
          members={list}
          loading={listLoading}
          error={listError}
          onRetry={() => dispatch(fetchMembers(query))}
          onAddMember={() => setIsAddMemberOpen(true)}
        />
        {total > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setCurrentPage}
            itemLabel="members"
          />
        )}
      </div>

      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
      />
    </div>
  );
}
