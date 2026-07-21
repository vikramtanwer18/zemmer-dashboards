import React from "react";
import { Icon } from "@/components/ui/icon";

interface OverdueMember {
  initials: string;
  name: string;
  plan: string;
  daysOverdue: number;
  amountDue: string;
  lastReminder: string;
}

export const OverdueTable: React.FC = () => {
  const members: OverdueMember[] = [
    { initials: "RH", name: "Rohan Hardas", plan: "Premium Annual Plan", daysOverdue: 14, amountDue: "₹4,500", lastReminder: "2 days ago" },
    { initials: "PK", name: "Priya Kapoor", plan: "Monthly Basic", daysOverdue: 8, amountDue: "₹1,200", lastReminder: "None" },
    { initials: "MS", name: "Marcus Smith", plan: "Personal Training (12 Sessions)", daysOverdue: 21, amountDue: "₹12,000", lastReminder: "5 days ago" },
  ];

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
      <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-error/10 text-error rounded-lg">
            <Icon name="payments" size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-on-surface">Revenue Leakage: Overdue Members</h4>
            <p className="text-xs text-outline font-medium uppercase tracking-wider">Requires Immediate Attention</p>
          </div>
        </div>
        <button className="text-error text-sm font-bold hover:underline">View All Overdue</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Member</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Days Overdue</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Amount Due</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Last Reminder</th>
              <th className="px-8 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {members.map((member) => (
              <tr key={member.name} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center font-bold text-primary">
                      {member.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{member.name}</p>
                      <p className="text-[11px] text-outline font-medium">{member.plan}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-error-container/20 text-error text-[11px] font-bold rounded-full">
                    {member.daysOverdue} Days
                  </span>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-black text-on-surface">{member.amountDue}</p>
                </td>
                <td className="px-8 py-5">
                  <p className="text-xs text-outline">{member.lastReminder}</p>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="bg-error text-on-error text-[11px] font-bold px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 ml-auto shadow-sm">
                    <Icon name="notifications_active" size={14} />
                    Send Reminder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
