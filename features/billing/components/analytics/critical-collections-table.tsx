import React from "react";
import { Icon } from "@/components/ui/icon";

const collections = [
  { name: "John Stephenson", initials: "JS", plan: "Premium Yearly", date: "Jun 12, 2024", amount: "₹12,500", status: "15 Days Overdue", overdue: true },
  { name: "Sarah Connor", avatar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop", plan: "Standard Monthly", date: "Jun 14, 2024", amount: "₹3,200", status: "13 Days Overdue", overdue: true },
  { name: "Mike Danforth", initials: "MD", plan: "PT Package (10)", date: "Jun 15, 2024", amount: "₹8,000", status: "Pending", overdue: false },
];

export const CriticalCollectionsTable: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-atmospheric border border-outline-variant/10 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-on-surface tracking-tighter">Critical Collections</h3>
        <button className="text-xs font-black px-4 py-2  border border-primary/10 rounded-lg  tracking-widest bg-primary text-white transition-all active:scale-95">
          View All Records
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-outline-variant/5">
              <th className="pb-4 text-[10px] font-black text-outline uppercase tracking-[0.2em]">Member</th>
              <th className="pb-4 text-[10px] font-black text-outline uppercase tracking-[0.2em]">Plan</th>
              <th className="pb-4 text-[10px] font-black text-outline uppercase tracking-[0.2em]">Due Date</th>
              <th className="pb-4 text-[10px] font-black text-outline uppercase tracking-[0.2em]">Amount</th>
              <th className="pb-4 text-[10px] font-black text-outline uppercase tracking-[0.2em] text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {collections.map((item, idx) => (
              <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors group/row cursor-pointer border-b border-outline-variant/5 last:border-b-0">
                <td className="py-4 flex items-center gap-4">
                  {item.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/10 shadow-sm transition-transform duration-300 group-hover/row:scale-110">
                      <img src={item.avatar} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center text-[10px] font-black border border-primary/10 transition-transform duration-300 group-hover/row:scale-110">
                      {item.initials}
                    </div>
                  )}
                  <span className="font-bold text-on-surface tracking-tight group-hover/row:text-primary transition-colors">{item.name}</span>
                </td>
                <td className="py-4 text-on-surface-variant font-bold text-[10px]  tracking-widest">{item.plan}</td>
                <td className="py-4 text-on-surface-variant font-bold text-xs">{item.date}</td>
                <td className="py-4 font-black text-on-surface tracking-tighter text-base">{item.amount}</td>
                <td className="py-4 text-right">
                  <span className={`px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest border ${item.overdue ? 'bg-error/10 text-error border-error/20 shadow-sm animate-pulse' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/20'
                    }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
