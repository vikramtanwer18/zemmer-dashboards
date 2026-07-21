import React from "react";
import { Icon } from "@/components/ui/icon";

interface Payment {
  id: string;
  date: string;
  amount: string;
  status: "PAID" | "PENDING";
}

export const PaymentHistory: React.FC = () => {
  const payments: Payment[] = [
    { id: "INV-8821", date: "Nov 01, 2024", amount: "₹2,500", status: "PAID" },
    { id: "INV-8954", date: "Dec 01, 2024", amount: "₹2,500", status: "PENDING" },
    { id: "INV-8710", date: "Oct 01, 2024", amount: "₹2,500", status: "PAID" },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-atmospheric border border-outline-variant/10 overflow-hidden group">
      <div className="px-6 py-5 flex justify-between items-center relative z-10 border-b border-outline-variant/10 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h3 className="text-[10px] font-black text-outline tracking-[0.2em] uppercase">Billing & Transactions</h3>
        </div>
        <button className="text-primary text-[10px] font-black tracking-widest uppercase hover:underline">View All Records</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Transaction ID</th>
              <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Processing Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Verification</th>
              <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-surface-container-low transition-all group/row">
                <td className="px-6 py-5 text-xs font-black text-on-surface tracking-tight">{payment.id}</td>
                <td className="px-6 py-5 text-xs text-outline font-bold">{payment.date}</td>
                <td className="px-6 py-5 text-sm font-black text-on-surface tracking-tighter">{payment.amount}</td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border ${payment.status === 'PAID'
                    ? 'bg-green-500/10 text-green-600 border-green-500/20'
                    : 'bg-primary/10 text-primary border-primary/20'
                    }`}>
                    {payment.status === 'PAID' ? 'Verified' : 'Processing'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  {payment.status === 'PENDING' ? (
                    <button className="h-8 px-4 bg-primary text-on-primary text-[10px] font-black rounded-lg tracking-widest uppercase shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95">
                      Pay Now
                    </button>
                  ) : (
                    <button className="w-8 h-8 ml-auto rounded-lg text-outline/40 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center group-hover/row:scale-110">
                      <Icon name="download" size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
