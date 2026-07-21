import React from "react";
import Link from "next/link";
import { InvoiceCard } from "@/features/billing/components/details/invoice-card";
import { InvoiceHistory } from "@/features/billing/components/details/invoice-history";
import { MemberPreview } from "@/features/billing/components/details/member-preview";
import { BillingInsights } from "@/features/billing/components/details/billing-insights";
import { InternalNotes } from "@/features/billing/components/details/internal-notes";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function InvoiceDetailsPage() {
  const invoiceId = "#GOS-2023-8842";
  const memberName = "Alex Rivera";

  return (
    <div className="pt-8 px-8 pb-12 max-w-[1600px] mx-auto min-h-screen">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs text-outline mb-6 font-semibold">
        <Link href="/billing" className="hover:text-primary transition-colors">Billing</Link>
        <Icon name="chevron_right" size={14} className="mx-1.5 opacity-50" />
        <span className="text-on-surface">Invoice Details</span>
      </nav>

      {/* Header Block */}
      <section className="relative bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl ring-4 ring-primary/5">
              INV
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-on-surface">
                  Invoice {invoiceId}
                </h1>
                <span className="px-3 py-1 text-[10px] font-bold tracking-wider rounded-full border uppercase bg-amber-500/10 text-amber-700 border-amber-500/20">
                  Pending
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Pill icon="person" label={memberName} />
                <Pill icon="calendar_today" label="Issued Oct 12, 2023" muted />
                <Pill icon="schedule" label="Due in 3 days" muted />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 lg:mt-0 shrink-0">
            <Button
              variant="outline"
              className="h-10 px-5 text-sm rounded-xl font-semibold border-outline-variant/20 hover:bg-surface-container-low transition-all"
            >
              <Icon name="file_download" size={18} className="mr-1.5" />
              Download
            </Button>
            <Button
              variant="primary"
              className="h-10 whitespace-nowrap px-6 text-sm rounded-xl shadow-sm hover:shadow-md transition-all font-semibold"
            >
              <Icon name="send" size={18} className="mr-1.5" />
              Send Reminder
            </Button>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Details & History */}
        <div className="lg:col-span-8 space-y-8">
          <InvoiceCard />
          <InvoiceHistory />
        </div>

        {/* Right Section: Member & Context */}
        <div className="lg:col-span-4 space-y-8">
          <MemberPreview />
          <BillingInsights />
          <InternalNotes />
        </div>
      </div>
    </div>
  );
}

function Pill({
  icon,
  label,
  muted,
}: {
  icon: string;
  label: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant/10 ${muted ? "text-outline" : "text-on-surface-variant"}`}
    >
      <Icon name={icon} size={14} className={muted ? "text-outline/70" : "text-primary"} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
