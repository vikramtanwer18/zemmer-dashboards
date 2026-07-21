import React from "react";
import { Icon } from "@/components/ui/icon";

export const InvoiceCard: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10 shadow-sm relative overflow-hidden group">
      {/* Decorative Brand Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none transition-colors group-hover:bg-primary/10"></div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8 relative z-10">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1.5">Bill To</p>
            <h3 className="text-2xl font-bold text-on-surface tracking-tight">Arjun Sharma</h3>
          </div>
          <div className="text-on-surface-variant font-medium text-sm space-y-2">
            <p className="flex items-center gap-2.5">
              <Icon name="mail" size={16} className="text-primary/60" />
              arjun.sharma@example.com
            </p>
            <p className="flex items-center gap-2.5">
              <Icon name="call" size={16} className="text-primary/60" />
              +91 98765 43210
            </p>
          </div>
        </div>
        <div className="md:text-right bg-surface-container-low/50 px-6 py-4 rounded-2xl border border-outline-variant/10">
          <p className="text-[10px] font-bold text-outline tracking-widest uppercase mb-1">Due Date</p>
          <p className="text-xl font-bold text-on-surface tracking-tight">Oct 26, 2023</p>
        </div>
      </div>

      {/* Itemized List */}
      <div className="relative z-10">
        <div className="grid grid-cols-12 pb-4 border-b border-outline-variant/10 px-2">
          <span className="col-span-6 text-[10px] font-bold text-outline tracking-widest uppercase">Description</span>
          <span className="col-span-2 text-[10px] font-bold text-outline tracking-widest uppercase text-center">Qty</span>
          <span className="col-span-4 text-[10px] font-bold text-outline tracking-widest uppercase text-right">Amount</span>
        </div>

        <div className="space-y-1 mt-2">
          <InvoiceItem 
            title="Base Membership" 
            desc="Access to Elite Performance main facility" 
            qty={1} 
            price="₹80.00" 
          />
          <InvoiceItem 
            title="Personal Training" 
            desc="4 Sessions with Senior Trainer" 
            qty={1} 
            price="₹40.00" 
          />
        </div>
      </div>

      {/* Totals */}
      <div className="mt-10 pt-8 border-t border-outline-variant/10 flex justify-end relative z-10">
        <div className="w-full max-w-[300px] space-y-4">
          <div className="flex justify-between text-sm font-medium text-on-surface-variant">
            <span>Subtotal</span>
            <span className="text-on-surface">₹120.00</span>
          </div>
          <div className="flex justify-between text-sm font-medium text-on-surface-variant">
            <span>Tax (0%)</span>
            <span className="text-on-surface">₹0.00</span>
          </div>
          <div className="flex justify-between items-center pt-5 border-t border-outline-variant/10">
            <span className="text-base font-bold text-on-surface">Total Due</span>
            <span className="text-3xl font-bold text-primary tracking-tight">₹120.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function InvoiceItem({ title, desc, qty, price }: { title: string, desc: string, qty: number, price: string }) {
  return (
    <div className="grid grid-cols-12 items-center py-4 px-2 rounded-2xl hover:bg-surface-container-low transition-colors group/item">
      <div className="col-span-6">
        <p className="font-bold text-on-surface text-base group-hover/item:text-primary transition-colors">{title}</p>
        <p className="text-xs text-outline font-medium mt-0.5">{desc}</p>
      </div>
      <span className="col-span-2 text-on-surface-variant text-sm text-center font-semibold">{qty}</span>
      <span className="col-span-4 text-on-surface text-base text-right font-bold tracking-tight">{price}</span>
    </div>
  );
}
