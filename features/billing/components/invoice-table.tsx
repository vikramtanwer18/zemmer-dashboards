import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { Invoice, InvoiceStatus } from "@/lib/api/domain-types";
import { formatPaise, formatDate } from "@/lib/utils/format";
import { Skeleton } from "@/components/ui/states";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: InvoiceStatus) => Promise<void>;
}

const StatusBadge = ({ status, onClick }: { status: InvoiceStatus, onClick?: () => void }) => {
  const styles = {
    PAID: 'bg-primary/10 text-primary border-primary/20',
    PENDING: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    FAILED: 'bg-error/10 text-error border-error/20',
    REFUNDED: 'bg-outline/10 text-outline border-outline/20'
  };

  return (
    <button 
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all active:scale-95",
        styles[status] || styles.PENDING,
        onClick && "hover:shadow-sm cursor-pointer"
      )}
    >
      {status.toLowerCase()}
      {onClick && <Icon name="expand_more" size={12} />}
    </button>
  );
};

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  isLoading,
  total,
  page,
  totalPages,
  onPageChange,
  onDelete,
  onUpdateStatus,
}) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (id: string, status: InvoiceStatus) => {
    setActiveMenu(null);
    await onUpdateStatus(id, status);
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="p-20 text-center">
        <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="receipt_long" size={32} className="text-outline" />
        </div>
        <h3 className="text-lg font-bold text-on-surface">No invoices found</h3>
        <p className="text-sm text-outline">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 border-b border-outline-variant/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Member</th>
              <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Invoice ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Due Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {invoices.map((invoice) => (
              <tr 
                key={invoice.id} 
                className="hover:bg-primary/[0.02] transition-colors group/row border-b border-outline-variant/10 last:border-b-0"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-outline-variant/10 shadow-sm transition-transform duration-300 group-hover/row:scale-105">
                      {invoice.member?.name?.[0] || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface text-base group-hover/row:text-primary transition-colors">{invoice.member?.name || "Unknown Member"}</p>
                      <p className="text-xs text-on-surface-variant/70 font-medium mt-0.5">{invoice.member?.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-on-surface-variant tabular-nums">#{invoice.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-6 py-4 text-sm font-bold text-on-surface">{formatPaise(invoice.amount_paise)}</td>
                <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{formatDate(invoice.due_date)}</td>
                <td className="px-6 py-4 relative">
                  <StatusBadge 
                    status={invoice.status} 
                    onClick={() => setActiveMenu(activeMenu === invoice.id ? null : invoice.id)} 
                  />
                  {activeMenu === invoice.id && (
                    <div 
                      ref={menuRef}
                      className="absolute z-[60] mt-2 left-6 w-32 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-atmospheric overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                    >
                      {(['PENDING', 'PAID', 'FAILED', 'REFUNDED'] as InvoiceStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(invoice.id, s)}
                          className={cn(
                            "w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors",
                            invoice.status === s ? "bg-primary/5 text-primary" : "text-on-surface-variant hover:bg-surface-container-low"
                          )}
                        >
                          {s.toLowerCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setDeleteId(invoice.id)}
                      className="p-2 text-outline hover:text-error hover:bg-error/10 rounded-lg transition-colors active:scale-95"
                    >
                      <Icon name="delete" size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-lowest">
        <p className="text-xs font-medium text-outline">Showing {invoices.length} of {total} Invoices</p>
        <div className="flex items-center gap-2">
          <button 
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors disabled:opacity-30 active:scale-90" 
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <Icon name="chevron_left" size={20} />
          </button>
          <span className="px-3 text-sm font-bold text-primary">{page} / {totalPages || 1}</span>
          <button 
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors disabled:opacity-30 active:scale-90"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <Icon name="chevron_right" size={20} />
          </button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};
