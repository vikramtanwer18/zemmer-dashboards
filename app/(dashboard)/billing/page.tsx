"use client";

import React, { useEffect } from "react";
import { BillingStats } from "@/features/billing/components/billing-stats";
import { InvoiceTable } from "@/features/billing/components/invoice-table";
import { InvoiceFilters } from "@/features/billing/components/invoice-filters";
import { AutoCollectPulse } from "@/features/billing/components/auto-collect-pulse";
import { InvoiceDialog } from "@/features/billing/components/invoice-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInvoices, deleteInvoice, updateInvoice } from "@/store/slices/billing.slice";
import { fetchRevenueAnalytics } from "@/store/slices/analytics.slice";
import { InvoiceStatus } from "@/lib/api/domain-types";
import { toast } from "sonner";

export default function BillingPage() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<InvoiceStatus | "">("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { list: invoices, listLoading, total, page, totalPages } = useAppSelector(s => s.billing);
  const { revenue, revenueLoading } = useAppSelector(s => s.analytics);

  useEffect(() => {
    dispatch(fetchRevenueAnalytics());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchInvoices({ search, status: filterStatus, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, search, filterStatus]);

  const handlePageChange = (newPage: number) => {
    dispatch(fetchInvoices({ search, status: filterStatus, page: newPage }));
  };

  const handleDeleteInvoice = async (id: string) => {
    const action = await dispatch(deleteInvoice(id));
    if (deleteInvoice.fulfilled.match(action)) {
      toast.success("Invoice deleted");
      dispatch(fetchRevenueAnalytics());
      dispatch(fetchInvoices({ search, status: filterStatus, page }));
    } else {
      toast.error((action.payload as string) ?? "Unable to delete invoice");
    }
  };

  const handleUpdateInvoiceStatus = async (id: string, status: InvoiceStatus) => {
    const action = await dispatch(updateInvoice({ id, patch: { status } }));
    if (updateInvoice.fulfilled.match(action)) {
      toast.success(`Status updated to ${status.toLowerCase()}`);
      dispatch(fetchRevenueAnalytics());
      dispatch(fetchInvoices({ search, status: filterStatus, page }));
    } else {
      toast.error((action.payload as string) ?? "Unable to update status");
    }
  };

  return (
    <div className="p-8 pb-12 max-w-[1600px] mx-auto min-h-screen relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tighter mb-1">Invoices</h2>
          <p className="text-sm text-outline font-medium max-w-xl">
            Manage membership dues, track payment history, and send automated billing reminders to your elite athletes.
          </p>
        </div>
        <Button
          variant="primary"
          className="h-11 max-w-[200px] px-6 text-xs shadow-lg shadow-primary/20"
          onClick={() => setIsDialogOpen(true)}
        >
          <Icon name="add_card" size={18} />
          Create Invoice
        </Button>
      </div>

      {/* Summary Bento Cards */}
      <BillingStats 
        outstandingPaise={revenue?.outstanding.totalPaise || 0}
        pendingCount={revenue?.outstanding.invoiceCount || 0}
        overduePaise={revenue?.outstanding.overduePaise || 0}
        recentPaise={revenue?.monthlyTrend[revenue.monthlyTrend.length - 1]?.revenuePaise || 0}
        recentCount={revenue?.counts.paidLastNMonths || 0}
      />

      {/* Main Content Section */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-atmospheric overflow-hidden">
        <InvoiceFilters 
          search={search}
          onSearchChange={setSearch}
          status={filterStatus}
          onStatusChange={(val) => setFilterStatus(val as any)}
        />
        <InvoiceTable 
          invoices={invoices}
          isLoading={listLoading}
          total={total}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onDelete={handleDeleteInvoice}
          onUpdateStatus={handleUpdateInvoiceStatus}
        />
      </div>

      <InvoiceDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      {/* Floating Action Component */}
      <AutoCollectPulse />
    </div>
  );
}

